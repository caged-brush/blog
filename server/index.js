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

const app = express();
const port = 3000;
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

function validateUserInput(req, res, next) {
  const { fname, lname, email, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![fname, lname, email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
}

async function authenticateJWT (req, res, next) {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }
    const payload = jwt.verify(jwtToken, process.env.SESSION_SECRET);

    req.user=payload.user;

    next();
  } catch (error) {
    console.error(error.message);
    res.status(403).json("You are not authorized");
  }
}

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
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
    res.json(req.user);
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

app.get("/nyt", async (req, res) => {
  try {
    const result = await axios.get(
      `https://api.nytimes.com/svc/archive/v1/2024/1.json?api-key=${process.env.NYT}`
    );
    res.json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/blog", async (req, res) => {
  const { title } = req.body;
  const { post } = req.body;
  const { user_id } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO posts (user_id,title,user_post) VALUES($1,$2,$3) RETURNING*",
      [user_id, title, post]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
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
      res.status(200).json({ email, token });
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
            // user, // Include user data here
            // success: true,
            // redirect: "http://localhost:5173/",
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
      callbackURL: "http://localhost:5173",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const result = await db.query("SELECT * FROM users WHERE email=$1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (fname,lname,email,password) VALUES ($1,$2,$3,$4)",
            [
              profile.name.givenName,
              profile.name.familyName,
              profile.email,
              "google",
            ]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
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

app.listen(port, (req, res) => {
  console.log(`Server now listening on port`);
});
