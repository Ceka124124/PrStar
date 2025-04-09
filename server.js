const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Statik dosyaları sunmak için
app.use(express.static('public'));

// Socket.io bağlantı
io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı');

  socket.on('mute', () => {
    console.log('Ses kapatıldı');
  });

  socket.on('unmute', () => {
    console.log('Ses açıldı');
  });

  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı');
  });
});

// Sunucuyu başlat
server.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});
