# Tic-Tac-Toe game implemented in NodeJS with sockets.

Use `npm install` to install the dependencies

The server can be started like:

	node  server.js 5050

Once the server started, it will listen on the specified port (5050) for clients to connect.

The client will be started like:

	node client.js 127.0.0.1 5050

The client will connect to the server at the specified IP (127.0.0.1) and port (5050). Upon connection the client will display a message and prompt, like:

	connected to 127.0.0.1 5050
	>

When two clients have connected to the server, the game will begin. The server will send each client the message:

	Game started. You are the [first | second] player.

The first player can then send a move like:

	> 5

This move would place an ‘X’ at square number 5.

The Tic-Tac-Toe board is numbered like this:

| 1 | 2 | 3 |
|---|---|---|
| 4 | 5 | 6 |
| 7 | 8 | 9 |


When the move is accepted by the server, it sends the current board position to both clients, like:

| . | . | . |
|---|---|---|
| . | X | . |
| . | . | . |



Let’s say the second player make the move:

	> 9

Both clients would then receive the new board position of:

| . | . | . |
|---|---|---|
| . | X | . |
| . | . | O |


Either player can resign the game at anytime, by sending ‘r’. 
When the game is over, the server sends both players a result message, like:

	Game won by [first | second] player.
Or

	Game is tied.

The clients close the connection to the server after the game is over. The clients can connect again to play another game.

