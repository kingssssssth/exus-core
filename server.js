const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const players = {};

io.on("connection", (socket) => {
    console.log("Jugador conectado:", socket.id);

    players[socket.id] = {
        id: socket.id,
        x: 0,
        y: 2,
        z: 0
    };

    socket.emit("playerId", socket.id);
    io.emit("players", players);

    socket.on("playerMove", (data) => {
        if (!players[socket.id]) return;

        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        players[socket.id].z = data.z;

        socket.broadcast.emit("playerMoved", {
            id: socket.id,
            x: data.x,
            y: data.y,
            z: data.z
        });
    });

    socket.on("disconnect", () => {
        console.log("Jugador desconectado:", socket.id);

        delete players[socket.id];

        io.emit("playerDisconnected", socket.id);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`EXUS CORE funcionando en http://localhost:${PORT}`);
});