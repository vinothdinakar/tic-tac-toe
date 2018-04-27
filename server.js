'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var thisServer = this;

this.clients = [];
this.portNumber = process.argv[2] || 5050;
this.clientCount = 0;
this.gameBoard = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
this.currentPlayer = 0;
this.gameStatus = 0;
this.gameMoveCount = 0;


http.listen(this.portNumber, function(){
    console.log('listening on ' + thisServer.portNumber);
}.bind(thisServer));

io.on('connection', function(socket){
    console.log('a user connected');
    //console.log(socket);
    var newClientId = thisServer.clientCount++;
    thisServer.clients[newClientId] = socket;
    thisServer.communicate(newClientId, 'init', 'Welcome to Tic-Tac-Toe');

    if (this.clients.length === 2) {
        console.log('Two clients joined');
        //console.log(thisServer.gameBoard);
        thisServer.gameStatus = 1;
        thisServer.broadcast('gameBegins', {
            gameBoard: thisServer.gameBoard,
            currentPlayer: thisServer.currentPlayer
        });
    }

    socket.on('disconnect', function (message) {
        console.log('Client disconnected')
    });

    socket.on('userMove', function (clientId, userInput) {
        //console.log(userInput);
        //console.log(clientId);
        thisServer.gameMoveCount++;

        if (userInput === 'r') {
            thisServer.broadcast('gameResigned', {
                status: 'Resign',
                player: clientId
            });
        }
        else {
            if (clientId === 0) {
                thisServer.gameBoard[userInput-1] = 'X'
            }
            else {
                thisServer.gameBoard[userInput-1] = 'O'
            }
            if (thisServer.checkWins(clientId)) {
                console.log('Game Over');
                thisServer.gameStatus = 2;
                thisServer.broadcast('gameOver', {
                    status: 'Win',
                    player: clientId,
                    gameBoard: thisServer.gameBoard
                });
            }

            if (thisServer.currentPlayer == 1) {
                thisServer.currentPlayer = 0;
            }
            else if (thisServer.currentPlayer == 0) {
                thisServer.currentPlayer = 1;
            }

            //console.log(thisServer.gameBoard);
            //console.log('thisServer.currentPlayer');
            //console.log(thisServer.currentPlayer);
            //console.log(!thisServer.currentPlayer);
            if (thisServer.gameStatus === 1) {
                thisServer.broadcast('gameMove', {
                    gameBoard: thisServer.gameBoard,
                    currentPlayer: thisServer.currentPlayer
                });

                if (thisServer.gameMoveCount === 9) {
                    thisServer.broadcast('gameOver', {
                        status: 'Tie',
                        gameBoard: thisServer.gameBoard
                    });
                }

            }

        }


    });



}.bind(thisServer));


this.communicate = function (clientId, channel, message) {
    this.clients[clientId].emit(channel, message, clientId);

};

this.broadcast = function (channel, message) {
    for (const clientId in this.clients) {
        this.communicate(clientId, channel, message);
    }
};

this.startGame = function () {
    this.gameBoard = [9];


};

this.checkWins = function (clientId) {
    var clientSym = '';
    if (clientId === 0) {
        clientSym = 'X'
    }
    else {
        clientSym = 'O'
    }

    return this.checkPosition(clientSym, 1, 2, 3)
    || this.checkPosition(clientSym, 4, 5, 6)
        || this.checkPosition(clientSym, 7, 8, 9)
        || this.checkPosition(clientSym, 1, 4, 7)
        || this.checkPosition(clientSym, 2, 5, 8)
        || this.checkPosition(clientSym, 3, 6, 9)
        || this.checkPosition(clientSym, 1, 5, 9)
        || this.checkPosition(clientSym, 3, 5, 7)

};

this.checkPosition = function (clientSym, pos1, pos2, pos3) {
    if (this.gameBoard[pos1-1] === clientSym && this.gameBoard[pos2-1] === clientSym  && this.gameBoard[pos3-1] === clientSym ) {
        return true;
    }
};

