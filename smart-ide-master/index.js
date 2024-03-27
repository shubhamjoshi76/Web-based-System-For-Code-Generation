const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("build"));
app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
	// Map
	return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
		(socketId) => {
			return {
				socketId,
				username: userSocketMap[socketId].username,
				photo: userSocketMap[socketId].photo,
			};
		},
	);
}

io.on(ACTIONS.CONNECTION, (socket) => {
	socket.on(ACTIONS.JOIN, ({ roomId, photo, username }) => {
		userSocketMap[socket.id] = { username, photo };
		socket.join(roomId);

		const clients = getAllConnectedClients(roomId);
		clients.forEach(({ socketId }) => {
			io.to(socketId).emit(ACTIONS.JOINED, {
				clients,
				username,
				photo,
				socketId: socket.id,
			});
		});

		console.log(
			"\nSocket :",
			socket.id,
			"\nRoom   :",
			roomId,
			"\nUser   :",
			username,
		);
	});

	socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code, pos }) => {
		socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code, pos });
	});

	socket.on(ACTIONS.SYNC_CODE, ({ socketId, code, pos }) => {
		io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code, pos });
	});

	socket.on(ACTIONS.DISCONNECTING, () => {
		const rooms = [...socket.rooms];
		rooms.forEach((roomId) => {
			socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
				socketId: socket.id,
				username: userSocketMap[socket.id].username,
				photo: userSocketMap[socket.id].photo,
			});
		});
		delete userSocketMap[socket.id];
		socket.leave();
	});
});

const PORT = process.env.PORT || 1337;
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
