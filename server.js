
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    socket.on('join-room', (room) => {
        socket.join(room);
        socket.to(room).emit('user-connected', socket.id);
    });

    socket.on('ice-candidate', (candidate, room) => {
        socket.to(room).emit('ice-candidate', candidate);
    });

    socket.on('sdp-offer', (offer, room) => {
        socket.to(room).emit('sdp-offer', offer, socket.id);
    });

    socket.on('sdp-answer', (answer, room) => {
        socket.to(room).emit('sdp-answer', answer);
    });

    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı:', socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
