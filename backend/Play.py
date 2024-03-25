from math import inf
import ConnectFourBoard
from copy import deepcopy
import random

MAX = 1
MIN = 2

class Play:
    def __init__(self):
        self.board = ConnectFourBoard.ConnectFourBoard()
        self.game_difficulty = "easy"
        self.game_type = ""
        
    def humanTurn(self,column,player):
        move = column
        moves  = self.board.getPossibleMoves()
        moverow = [m for m in moves if m[1] == move]
        
        if moverow.__len__() == 0 :
            # player cannot play here the column is is full
            return False
        else:
            self.board.makeMove(moverow[0][0],moverow[0][1],player)

        
            
    def computerTurn(self,player=MAX):
        print(f"Computer turn (player {player})")
        eval,best_move = self.MinimaxAlphaBetaPruning(board=self.board,depth=5,player=player)
        self.board.makeMove(best_move[0],best_move[1],player)        

    
    def MinimaxAlphaBetaPruning(self, board, depth, alpha=-inf, beta=+inf, player=MAX):
        if depth == 0 or board.gameOver() != 0:
            if player == MAX:
                if self.game_type == "CvsC" :
                    x = random.randint(1,3)
                    match x:
                        case 1:
                            return board.EasyHeuristic(player=MIN), None
                        case 2:
                            return board.MediumHeuristic(player=MIN), None
                        case 3:
                            return board.HardHeuristic(player=MIN), None

                else:
                    if self.game_difficulty == "easy":
                        return board.EasyHeuristic(player=MIN), None
                    elif self.game_difficulty == "medium":  
                        return board.MediumHeuristic(player=MIN), None
                    else:   
                        return board.HardHeuristic(player=MIN), None
            else:
                if self.game_type == "CvsC" :
                    x = random.randint(1,3)
                    match x:
                        case 1:
                            return board.EasyHeuristic(player=MAX), None
                        case 2:
                            return board.MediumHeuristic(player=MAX), None
                        case 3:
                            return board.HardHeuristic(player=MAX), None


                else:
                    if self.game_difficulty == "easy":
                        return board.EasyHeuristic(player=MAX), None
                    elif self.game_difficulty == "medium":  
                        return board.MediumHeuristic(player=MAX), None
                    else:   
                        return board.HardHeuristic(player=MAX), None
        if player == MAX:
            max_eval = -inf
            best_move = None
            for move in board.getPossibleMoves():
                temp_board = deepcopy(board)
                temp_board.makeMove(move[0], move[1], 2)
                eval, _ = self.MinimaxAlphaBetaPruning(temp_board, depth=depth-1, player=MIN, alpha=alpha, beta=beta)
                if eval > max_eval:
                    max_eval = eval
                    best_move = move
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
            return max_eval, best_move
        else:
            min_eval = inf
            best_move = None
            for move in board.getPossibleMoves():
                temp_board = deepcopy(board)
                temp_board.makeMove(move[0], move[1], 1)
                eval, _ = self.MinimaxAlphaBetaPruning(temp_board, depth=depth-1, player=MAX, alpha=alpha, beta=beta)
                if eval < min_eval:
                    min_eval = eval
                    best_move = move
                beta = min(beta, eval)
                if beta <= alpha:
                    break
            return min_eval, best_move