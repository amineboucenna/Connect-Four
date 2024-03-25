from flask import Flask
from Play import Play
from flask_socketio import SocketIO
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")  
game_difficulty = game_type = " "
current_player = 1
first_player = 1

@socketio.on('CommitPreferences')
def CommitPrefernces(prefrences):
    global play,first_player,current_player,game_type,game_difficulty
    play = Play()
    # prefrences are in JSON format
    # parsing jason format
    parsed_prefrences = json.loads(prefrences)

    game_type = parsed_prefrences['type']
    
    play.game_type = game_type
    game_difficulty =  parsed_prefrences['difficulty']

    if game_difficulty == "easy":
        play.game_difficulty = "easy"
    elif game_difficulty == "medium":
        play.game_difficulty = "medium"
    else:
        play.game_difficulty = "hard"


    first_player = int(parsed_prefrences['firstplayer'])
    current_player = 1

    if parsed_prefrences['type'] == "HvsC":
        # Player choosed to play vs computer
        socketio.emit('new_game',json.dumps({'board': play.board.board, 'current_player': first_player}))

    elif parsed_prefrences['type'] == "HvsH":
        socketio.emit('new_humans_game',json.dumps({'board': play.board.board, 'current_player': first_player}))
    else:
        current_player = 3 - first_player
        socketio.emit('new_ai_game', json.dumps({'board': play.board.board, 'current_player': first_player}))

@socketio.on('amove')
def move():
    
    play.computerTurn(1)
    socketio.emit('continue-game',json.dumps(play.board.board))



@socketio.on('ReplayGame')
def Replay():
    global play,first_player,current_player,game_type,game_difficulty
    play = None
    play = Play()
    play.game_difficulty = game_difficulty
    play.game_type = game_type
    if game_type == "HvsC":
    # Player choosed to play vs computer
        socketio.emit('new_game',json.dumps({'board': play.board.board, 'current_player': first_player}))

    elif game_type == "HvsH":
        socketio.emit('new_humans_game',json.dumps({'board': play.board.board, 'current_player': first_player}))
    else:
        current_player = 3 - first_player
        socketio.emit('new_ai_game', json.dumps({'board': play.board.board, 'current_player': first_player}))

@socketio.on('aiplaying')
def aimove():
    
    global current_player
    if current_player == 1:
        current_player = 2
    else:
        current_player = 1

    
    if play.board.gameOver() == 0:
        play.computerTurn(current_player)
        
        if play.board.gameOver() == 0:
            socketio.emit('mutex')
            socketio.emit('continue-game',json.dumps(play.board.board))
            return
        else:
            game_winner = play.board.gameOver() 
            socketio.emit('game-over',json.dumps({'board':play.board.board,'game_winner':game_winner}))
            return



@socketio.on('PlayMoveHuman')
def HumanPlaysMove(jsondata):
    if play.board.gameOver() == 0:
        data = json.loads(jsondata)
        if play.humanTurn(data['column'],data['current_player']) == False :
            socketio.emit('column-full', json.dumps({'message': 'Column is full'}))
            return
        else: 
            if play.board.gameOver() == 0:
                socketio.emit('continue-game',json.dumps(play.board.board))
            else:
                game_winner = play.board.gameOver() 
                socketio.emit('game-over',json.dumps({'board':play.board.board,'game_winner':game_winner}))
       

@socketio.on('PlayMove')
def checkMove(column):
    if play.board.gameOver() == 0:
        if first_player == 1:
            if play.humanTurn(column, 1) == False:
                # The user cannot play in the selected column
                socketio.emit('column-full', json.dumps({'message': 'Column is full'}))
                return
            if play.board.gameOver() == 0:
                socketio.emit('continue-game', json.dumps(play.board.board))
            else:
                game_winner = play.board.gameOver()
                socketio.emit('game-over',json.dumps({'board':play.board.board,'game_winner':game_winner}))
            
            
            play.computerTurn(2)
            if play.board.gameOver() == 0:
                socketio.emit('continue-game', json.dumps(play.board.board))
            else:
                game_winner = play.board.gameOver() 
                socketio.emit('game-over',json.dumps({'board':play.board.board,'game_winner':game_winner}))
            
        else:
            if play.humanTurn(column, 2) == False:
                socketio.emit('column-full', json.dumps({'message': 'Column is full'}))
                return

            if play.board.gameOver() == 0:
                socketio.emit('continue-game', json.dumps(play.board.board))
            else:
                game_winner = play.board.gameOver() 
                socketio.emit('game-over',json.dumps({'board':play.board.board,'game_winner':game_winner}))
            
            
            play.computerTurn(1)
            if play.board.gameOver() == 0:
                socketio.emit('continue-game', json.dumps(play.board.board))
            else:
                game_winner = play.board.gameOver() 
                socketio.emit('game-over',json.dumps({'board':play.board.board,'game_winner':game_winner}))
            
    else:
        game_winner = play.board.gameOver()
        # 1 for player 1 
        # 2 for player 2 
        # -1 for a tie 
        socketio.emit('game-over',json.dumps({'board':play.board.board,'game_winner':game_winner}))


if __name__ == '__main__':
    socketio.run(app)