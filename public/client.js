// Socket.io bağlantısını başlat
const socket = io();

// Ses açma ve kapama butonları
const muteBtn = document.getElementById('muteBtn');
const unmuteBtn = document.getElementById('unmuteBtn');

// Ses durumu
let isMuted = false;

// Sayfa yüklendiğinde sesli sohbet başlat
socket.on('connect', () => {
  document.getElementById('status').textContent = 'Bağlantı sağlandı!';
  console.log('Bağlantı sağlandı!');
  // Burada sesli sohbet başlatılabilir, örneğin medya akışı başlatılabilir
});

// Ses açma butonuna tıklama işlemi
unmuteBtn.addEventListener('click', () => {
  isMuted = false;
  unmuteBtn.style.display = 'none';
  muteBtn.style.display = 'inline';
  console.log('Ses açıldı');
  // Burada ses açma işlemi yapılabilir, örneğin medya akışını unmute etmek
  socket.emit('unmute');  // Sunucuya ses açma komutu gönder
});

// Ses kapama butonuna tıklama işlemi
muteBtn.addEventListener('click', () => {
  isMuted = true;
  muteBtn.style.display = 'none';
  unmuteBtn.style.display = 'inline';
  console.log('Ses kapatıldı');
  // Burada ses kapama işlemi yapılabilir, örneğin medya akışını mute etmek
  socket.emit('mute');  // Sunucuya ses kapama komutu gönder
});
