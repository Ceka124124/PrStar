const socket = io('https://pr-star.vercel.app'); // Sunucu adresi

// Ses açma ve kapama butonları
const muteBtn = document.getElementById('muteBtn');
const unmuteBtn = document.getElementById('unmuteBtn');

// Ses durumu
let isMuted = false;

// Sayfa yüklendiğinde sesli sohbet başlat
socket.on('connect', () => {
  document.getElementById('status').textContent = 'Bağlantı sağlandı!';
  console.log('Bağlantı sağlandı!');
});

// Ses açma butonuna tıklama işlemi
unmuteBtn.addEventListener('click', () => {
  isMuted = false;
  unmuteBtn.style.display = 'none';
  muteBtn.style.display = 'inline';
  console.log('Ses açıldı');
  socket.emit('unmute'); // Sunucuya ses açma komutu gönder
});

// Ses kapama butonuna tıklama işlemi
muteBtn.addEventListener('click', () => {
  isMuted = true;
  muteBtn.style.display = 'none';
  unmuteBtn.style.display = 'inline';
  console.log('Ses kapatıldı');
  socket.emit('mute'); // Sunucuya ses kapama komutu gönder
});
