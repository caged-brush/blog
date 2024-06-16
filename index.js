import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import bcrypt from "bcrypt";
import env from "dotenv";
import cors from "cors";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import passport from "passport";
import jwt from "jsonwebtoken";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SESSION_SECRET, { expiresIn: "3d" });
};
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/my-react-app/dist")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "client/my-react-app/dist", "index.html")
    );
  });
}

function validateUserInput(req, res, next) {
  const { fname, lname, email, password, confirm } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  function validPassword(userPassword) {
    // Define the regular expression for a valid password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Test the userPassword against the regular expression
    return passwordRegex.test(userPassword);
  }

  if (req.path === "/register") {
    if (![fname, lname, email, password, confirm].every(Boolean)) {
      return res.status(401).json({ error: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ error: "Invalid Email" });
    } else if (!validPassword(password)) {
      return res.status(401).json({
        error:
          "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character",
      });
    } else if (password !== confirm) {
      return res.status(401).json({ error: "Passwords do not match" });
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json({ error: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ error: "Invalid Email" });
    }
  }

  next();
}

async function authenticateJWT(req, res, next) {
  const jwtToken = req.header("token");

  if (!jwtToken) {
    return res.status(403).json("Not Authorized");
  }
  try {
    const payload = jwt.verify(jwtToken, process.env.SESSION_SECRET);

    req.user = payload.id;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(403).json("You are not authorized");
  }
}

const proConfig = {
  connectionString: process.env.DATABASE_URL,
};
const db = new pg.Client(
  process.env.NODE_ENV === "production"
    ? proConfig
    : {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
      }
);
db.connect();

app.get("/isVerified", authenticateJWT, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/dashboard", authenticateJWT, async (req, res) => {
  try {
    // res.json(req.user);
    const user = await db.query("SELECT fname FROM users WHERE id=$1", [
      req.user,
    ]);
    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/footy", async (req, res) => {
  try {
    const result = await axios.get(
      `https://www.scorebat.com/video-api/v3/feed/?token=${process.env.SPORT_BAT_VIDEO_TOKEN}`
    );
    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/nba", async (req, res) => {
  try {
    const result = await axios.get("https://api.balldontlie.io/v1/teams", {
      headers: {
        Authorization: process.env.BALL_DONT_LIE_API_KEY,
      },
    });
    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/news", async (req, res) => {
  try {
    const result = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS}`
    );
    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/blog", authenticateJWT, async (req, res) => {
  const { title, content } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO posts (user_id,title,user_post) VALUES($1,$2,$3) RETURNING*",
      [req.user, title, content]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT fname,lname,title,user_post,created_at FROM posts JOIN users ON id=user_id"
    );

    const posts = result.rows.map((row) => {
      const date = row.created_at;
      const post = row.user_post;
      const title = row.title;
      const fname = row.fname;
      const lname = row.lname;

      // Get the day, month, and year
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      // Array of month names
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Get the month name
      const monthName = months[monthIndex];

      // Reformat the date string
      const reformattedDate = `${day} ${monthName} ${year}`;

      return {
        fname: fname,
        lname: lname,
        title: title,
        date: reformattedDate,
        post: post,
      };
    });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get(
  "/auth/google/",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
    scope: ["profile", "email"],
  })
);

app.get("/", (req, res) => {
  res.redirect("http://localhost:5173");
});

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const token = createToken(req.user.id);
      res.redirect(`http://localhost:5173?token=${token}`);
    } catch (error) {
      console.error(error);
      res.redirect("/login");
    }
  }
);

app.post("/register", validateUserInput, async (req, res) => {
  const { fname, lname, email, password } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.json({ message: "Email already in user please login" });
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await db.query(
        "INSERT INTO users (fname,lname,email,password) VALUES ($1, $2,$3,$4) RETURNING *",
        [fname, lname, email, hashedPassword]
      );
      const user = result.rows[0];
      const userId = user.id;

      const token = createToken(userId);
      res.status(200).json({ token });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", validateUserInput, async (req, res) => {
  const email = req.body.email;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const userID = user.id;

      const storedHashedPassword = user.password;

      bcrypt.compare(loginPassword, storedHashedPassword, (err, isMatch) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ success: false, error: "Internal server error" });
        } else if (isMatch) {
          console.log("success");
          const token = createToken(userID);
          // Include user data in the response
          res.status(200).json({
            token,
          });
        } else {
          console.log("failure");
          res.json({ success: false, error: "Incorrect password" });
        }
      });
    } else {
      res.json({ success: false, error: "Email not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const existingUser = await db.query(
          "SELECT * FROM users WHERE email=$1",
          [profile.emails[0].value]
        );

        if (existingUser.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (fname,lname,email,password) VALUES ($1,$2,$3,$4) RETURNING *",
            [
              profile.name.givenName,
              profile.name.familyName,
              profile.emails[0].value,
              "google", // default password for google users
            ]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, existingUser.rows[0]);
        }
      } catch (error) {
        console.error(error);
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.get("*", (req, res) => {
  res.send("Page not found");
});

app.listen(port, (req, res) => {
  console.log(`Server now listening on port ${port}`);
});
