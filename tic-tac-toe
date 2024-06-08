//importations
#include <stdio.h>
#include <stdlib.h>

//creating 2D arrays
void playBoard(char b[3][3]);
char board[3][3];
int win(char board[3][3]);
int checkTie(char board[3][3]);

//main function
int main()
{

   char name[100];

   printf("What is your name: \n");
   
   scanf("%s", name);

   printf("Hello %s ... Let's have fun !!! You=X | Computer=O\n", name);

   char board[3][3]=
   {
      {' ',' ',' '},
      {' ',' ',' '},
      {' ',' ',' '},
   };

   //displays empty play board
   playBoard(board);
   
   //game play loop
   while(1)
   {
      printf("Enter X,Y coordinates(between 0-2) for your moves:");

      int x,y;

      //validates user input
      scanf("%d,%d",&x,&y);
      while(x<0 || x>3 || y<0 || y>3 || board[x][y]!=' ')
      {
        
         printf("Incorrect input,try again,Enter X,Y coordinates(between 0-2) for your moves:");
         scanf("%d,%d",&x,&y);

      }
      board[x][y]='X';
     
      //checks if user wins
      if(win(board))
      {
         playBoard(board);
         printf("%s wins \n",name);
         break;
      }
      //checks for tie
      else if(checkTie(board)==1)
      {
         printf("Its a tie!\n");
         break;
      }
      
      //computer's move
      while (1) 
      {
         x = rand() % 3;
         y = rand() % 3;
         if (board[x][y] == ' ') 
         {
            board[x][y]='O';
            break;
         }
      }
      
      //displays play board 
      playBoard(board);

      //check if computer wins
      if(win(board))
      {
         printf("Computer wins \n");
         break;
      }

      //checks for tie
      else if(checkTie(board)==1)
      {
         printf("Its a tie\n");
         break;
      }
   
   }
  
   
}
//Functions to display tic tac toe board
void playBoard(char board[3][3])
{
   printf(" %c |  %c| %c \n" ,board[0][0],board[0][1],board[0][2]);
   printf("---|---|--- \n");
   printf(" %c |  %c| %c \n" ,board[1][0],board[1][1],board[1][2]);
   printf("---|---|--- \n");
   printf(" %c |  %c| %c \n" ,board[2][0],board[2][1],board[2][2]);
}

//Checks for winner
int win(char board[3][3])
{
   int x;
   for(int i=0; i<3; i++)
   {
      if(board[i][0]!=' '&&board[i][0]==board[i][1]&&board[i][0]==board[i][2])
      {
         x=1;
         return x;
      }
   }
   for(int i=0; i<3; i++)
      if(board[0][i]!=' '&&board[0][i]==board[1][i]&&board[0][i]==board[2][i])
      {
         x=1;
         return x;
      }
   
      if(board[0][0]!=' '&&board[0][0]==board[1][1]&&board[0][0]==board[2][2])
      {
         x=1;
         return x;
      }

      if(board[0][2]!=' '&&board[0][2]==board[1][1]&&board[0][2]==board[2][0])
      {
         x=1;
         return x;
      }
      else
      {
         return 0;
      }
}
//checks for tie
int checkTie(char board[3][3])
{
    for (int i = 0; i < 3; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            if (board[i][j] == ' ')
            {
                return 0;  
            }
        }
    }
    return 1;  
}




