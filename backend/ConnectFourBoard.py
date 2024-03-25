import random
from copy import deepcopy

class ConnectFourBoard:

    def __init__(self):
        self.board_width, self.board_height = 7, 6
        self.board = [
            [0 for _ in range(self.board_width)] for _ in range(self.board_height)]

    def drawBoard(self):
        column_numbers = " | ".join(map(str, range(self.board_width)))
        str_line = '--------------------------'

        print(f"{str_line}\n{column_numbers}\n{str_line}")

        for row in self.board:
            print(" | ".join(map(str, row)))
            print(str_line)

    def getPossibleMoves(self):
        possible_moves = []

        for j in range(self.board_width):
            for i in range(self.board_height-1,-1,-1):
                if self.board[i][j] == 0:
                    if not any(m[1] == j for m in possible_moves):
                        possible_moves.append([i, j])

        return possible_moves

    def makeMove(self, row, col, piece):
        self.board[row][col] = piece

    def win(self, piece):
        for i in range(self.board_height):
            for j in range(self.board_width):
                if j + 3 < self.board_width and all(self.board[i][j + k] == piece for k in range(4)):
                    return True

                if i + 3 < self.board_height and all(self.board[i + k][j] == piece for k in range(4)):
                    return True

                if i + 3 < self.board_height and j + 3 < self.board_width and all(self.board[i + k][j + k] == piece for k in range(4)):
                    return True

                if i - 3 >= 0 and j + 3 < self.board_width and all(self.board[i - k][j + k] == piece for k in range(4)):
                    return True

        return False


    def gameOver(self):
        if self.win(1):
            return 1
        
        if self.win(2):
            return 2

        if self.getPossibleMoves() is not None:
            return 0
        else:
            return -1 #draw



    def MaybeWin(self, row, col, player):
        count = 0
        # H
        for offset in range(-3, 1):
            if 0 <= col + offset < self.board_width - 3:
                count += all(self.board[row][col + offset + k] == player for k in range(4))

        # V
        for offset in range(-3, 1):
            if 0 <= row + offset < self.board_height - 3:
                count += all(self.board[row + offset + k][col] == player for k in range(4))

        # diagonally
        for offset in range(-3, 1):
            if 0 <= row + offset < self.board_height - 3 and 0 <= col + offset < self.board_width - 3:
                count += all(self.board[row + offset + k][col + offset + k] == player for k in range(4))

        # anti diagonally
        for offset in range(-3, 1):
            if 0 <= row - offset < self.board_height - 3 and 0 <= col + offset < self.board_width - 3:
                count += all(self.board[row - offset - k][col + offset + k] == player for k in range(4))

        return count
    

    def EasyHeuristic(self, player):
        opponent = 3 - player

        score = 0

        for i in range(self.board_height):
            for j in range(self.board_width):
                if self.board[i][j] == opponent:
                    score += 10
                if self.board[i][j] == player:
                    score += 2
            
        return score 
        

    # Cette Heurisitque calcule ou il ya plus de valuer pour gagner
    def MediumHeuristic(self,player):

        score = 0

        for i in range(self.board_height):
            for j in range(self.board_width):
                #H
                if j <= self.board_width - 4:
                    array = [self.board[i][j + k] for k in range(4)]
                    if array.count(player) == 2 and array.count(0) == 1:
                        score += 1

                #V
                if i <= self.board_height - 4:
                    array = [self.board[i + k][j] for k in range(4)]
                    if array.count(player) == 2 and array.count(0) == 1:
                        score += 1

                #Diagonal
                if i <= self.board_height - 4 and j <= self.board_width - 4:
                    array = [self.board[i + k][j + k] for k in range(4)]
                    if array.count(player) == 2 and array.count(0) == 1:
                        score += 1

                #Anti Diagonal
                if i >= 3 and j <= self.board_width - 4:
                    array = [self.board[i - k][j + k] for k in range(4)]
                    if array.count(player) == 2 and array.count(0) == 1:
                        score += 1

        return score



    

    def HardHeuristic(self,player):

        # slice the board in 4 spots
        four_spots = []

        weights = {  # Four in a row
        3: 10000,   # Three in a row
        2: 2000,
        1: 100,  
        0: 50 # Two in a row
        }
        
        # vertical
        for j in range(self.board_width):
            for i in range(self.board_height - 3):
                column = [self.board[i + k][j] for k in range(4)]
                four_spots.append(column)

        # horizantal
        for i in range(self.board_height):
            for j in range(self.board_width - 3):
                line = [self.board[i][j+k] for k in range(4)]
                four_spots.append(line)

        #add the diagonals to the four_spots array
        for i in range(self.board_height - 3):
            for j in range(self.board_width - 3):
                # Diagonal
                diagonal = [self.board[i + k][j + k] for k in range(4)]
                four_spots.append(diagonal)

                # Anti-Diagonal
                anti_diagonal = [self.board[i + k][j + 3 - k] for k in range(4)]
                four_spots.append(anti_diagonal)

        # count player (add a point) every time in 
                            
        player_points = 0
        for f in four_spots:
            same = True
            count = 0
            for i in f:
                if i == player: 
                    count+=1
                elif i != 0: 
                    # this means there is oppenent in the current set
                    same = False
            if same:
                player_points += weights.get(count, 0)


        return  player_points
    



     

# idee heuristiaue
# ou il ya plus de de valuer pour gagner
# ex 3 in row


# montecarlo