// Socket.io server'ına bağlanma (Render'daki backend URL'sini kullanıyoruz)
const socket = io('https://prstar-voice-server.onrender.com'); // Render URL'si

let localStream;
let remoteStream;
let peerConnection;
const serverConfig = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // STUN sunucusu
};

// DOM elemanları
const startBtn = document.getElementById('start-btn');
const muteBtn = document.getElementById('mute-btn');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const connectionStatus = document.getElementById('connection-status');

// Mikrofon kontrolü
muteBtn.addEventListener('click', () => {
    const isMuted = localVideo.muted;
    localVideo.muted = !isMuted;
    muteBtn.textContent = isMuted ? 'Mikrofonu Kapat' : 'Mikrofonu Aç';
});

// Sohbete başla
startBtn.addEventListener('click', startCall);

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localVideo.srcObject = localStream;

        // WebRTC peer bağlantısını oluştur
        peerConnection = new RTCPeerConnection(serverConfig);

        // Local stream'i peerConnection'a ekle
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Remote stream için handler
        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };

        // ICE candidate'ları yönet
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        // WebRTC sinyalleşme işlemi (Offer gönderme)
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);

        startBtn.disabled = true;
        connectionStatus.textContent = 'Bağlantı Kuruluyor...';
    } catch (error) {
        console.error('WebRTC Hatası:', error);
    }
}

// Socket.io events (Backend ile iletişim)
socket.on('offer', async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', (answer) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on('disconnect', () => {
    connectionStatus.textContent = 'Bağlantı Kesildi';
});
