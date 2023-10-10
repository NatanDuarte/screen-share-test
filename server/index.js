const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const activeScreenSharingClients = new Set();
const activeRooms = new Map();

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors({ origin: '*' }));

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('joinRoom', (roomId) => {
        // Join the specified room
        socket.join(roomId);

        // Add the socket to the list of active screen sharing clients in this room
        if (!activeRooms.has(roomId)) {
            activeRooms.set(roomId, new Set());
        }
        activeRooms.get(roomId).add(socket);

        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('startScreenSharing', (roomId, stream) => {
        socket.to(roomId).emit('userScreenSharing', stream);
    });

    socket.on('stopScreenSharing', (roomId) => {
        // Remove the socket from the list of active screen sharing clients
        activeScreenSharingClients.delete(socket);

        // Broadcast a message to all connected clients that the screen sharing has stopped
        socket.to(roomId).broadcast.emit('screenSharingStopped');

        console.log(`User ${socket.id} stopped screen sharing`);
    });

    socket.on('getRoomList', () => {
        return activeRooms;
    });

    socket.on('disconnect', () => {
        io.sockets.adapter.rooms.forEach((roomId, roomName) => {
            if (roomName !== socket.id && roomId.has(socket.id)) {
                socket.leave(roomName);
                activeRooms.get(roomName)?.delete(socket);
            }
        });

        console.log(`User ${socket.id} disconnected`);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});