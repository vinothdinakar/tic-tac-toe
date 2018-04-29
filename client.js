'use strict';

var getUserInput = require('readline-sync');
var chalk = require('chalk');


var thisClient = this;

this.ipAddr = process.argv[2] || '127.0.0.1';
this.portNo = process.argv[3] || 5050;
this.ipUrl = 'http://' + this.ipAddr + ':' + this.portNo;
this.clientSocket = null;
this.clientId = null;
this.gameBoard = [9];

var connectToServer = function (thisClient) {
    thisClient.clientSocket = require('socket.io-client')(thisClient.ipUrl);

    thisClient.clientSocket.on('connect', function (socket) {
        console.log('Connected to ' + thisClient.ipAddr + ' ' + thisClient.portNo);
    }.bind(thisClient));

    thisClient.clientSocket.on('init', function (msg, clientId) {
        console.log(msg);
        thisClient.clientId = clientId;
        //console.log('Your clientId is '+ thisClient.clientId);
    }.bind(thisClient));

    thisClient.clientSocket.on('gameBegins', function (message) {
        var position = '';
        if (thisClient.clientId == 0) {
            position = 'first';
        }
        else {
            position = 'second';
        }
        var msg = 'Game Started. You are the ' + position + ' player.';

        console.log(msg);
        //console.log(message.gameBoard);
        thisClient.gameBoard = message.gameBoard;
        //console.log(clientId);
        thisClient.drawBoard();
        thisClient.whoseMove(message.currentPlayer);
    }.bind(thisClient));

    thisClient.clientSocket.on('gameMove', function (message) {

        thisClient.gameBoard = message.gameBoard;
        thisClient.drawBoard();
        thisClient.whoseMove(message.currentPlayer);

    });

//gameResigned

    thisClient.clientSocket.on('gameResigned', function (message) {
        //console.log(message);
        //thisClient.gameBoard = message.gameBoard;
        thisClient.showGameStatus(message);
        thisClient.clientSocket.emit('disconnect');
    }.bind(thisClient));

    thisClient.clientSocket.on('gameOver', function (message) {
        //console.log(message);
        thisClient.gameBoard = message.gameBoard;
        thisClient.drawBoard();
        thisClient.showGameStatus(message);
        thisClient.clientSocket.emit('disconnect');
    }.bind(thisClient));


};

this.whoseMove = function (currentPlayer) {
    if (currentPlayer == thisClient.clientId) {
        //console.log('starting game');
        console.log(chalk.blue('Its your move... (Type 1-9 or "r" to resign)...'));
        var validInput = false;
        while (validInput === false) {
            var userInput = getUserInput.question('>');
            //console.log('userInput '+userInput);

            if (userInput === 'r' || userInput > 0 && userInput <=9) {
                validInput = true;
            }
            else {
                console.log(chalk.blue('Invalid input. (Type 1-9 or "r" to resign)...'));
            }
        }
        thisClient.clientSocket.emit('userMove', thisClient.clientId, userInput);
    }
    else {
        console.log(chalk.blue('Wait for opponent to make a move...'));
    }
};

this.drawBoard = function () {
/*
    console.log('in drawboard');
    console.log(thisClient.gameBoard);
    console.log(thisClient.gameBoard.length);
*/


    var row1 = thisClient.gameBoard[0] + ' ' + thisClient.gameBoard[1] + ' ' + thisClient.gameBoard[2];
    var row2 = thisClient.gameBoard[3] + ' ' + thisClient.gameBoard[4] + ' ' + thisClient.gameBoard[5];
    var row3 = thisClient.gameBoard[6] + ' ' + thisClient.gameBoard[7] + ' ' + thisClient.gameBoard[8];

    console.log(chalk.green('------------------------- Current Board -------------------------'));
    console.log(chalk.green(row1));
    console.log(chalk.green(row2));
    console.log(chalk.green(row3));
};

this.showGameStatus = function (message) {
    if (message.status == 'Win') {
        if (message.player == thisClient.clientId) {
            console.log(chalk.green('You win!!!'));
        }
        else {
            console.log(chalk.red('Sorry. You Lost!!!'));
        }

    }
    else if (message.status == 'Resign') {
        if (message.player == thisClient.clientId) {
            console.log(chalk.green('You resigned'));
        }
        else {
            console.log(chalk.red('Sorry. Opponent has resigned the game'));
        }

    }
    else if (message.status == 'Tie') {
        console.log(chalk.red('Game Tied'));
    }

};

connectToServer(thisClient);