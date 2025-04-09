
const socket = io();
let localStream;
let peerConnections = {};
let room = "";

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

document.getElementById('joinBtn').onclick = async () => {
    room = document.getElementById('roomInput').value;
    socket.emit('join-room', room);
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    document.getElementById('status').innerText = 'Bağlı';

    socket.on('user-connected', (userId) => {
        const pc = new RTCPeerConnection(config);
        peerConnections[userId] = pc;
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.onicecandidate = (e) => {
            if (e.candidate) socket.emit('ice-candidate', e.candidate, room);
        };

        pc.ontrack = (e) => {
            const audio = document.createElement('audio');
            audio.srcObject = e.streams[0];
            audio.autoplay = true;
            document.body.appendChild(audio);
        };

        pc.createOffer().then(offer => {
            pc.setLocalDescription(offer);
            socket.emit('sdp-offer', offer, room);
        });
    });

    socket.on('sdp-offer', (offer, userId) => {
        const pc = new RTCPeerConnection(config);
        peerConnections[userId] = pc;
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.onicecandidate = (e) => {
            if (e.candidate) socket.emit('ice-candidate', e.candidate, room);
        };

        pc.ontrack = (e) => {
            const audio = document.createElement('audio');
            audio.srcObject = e.streams[0];
            audio.autoplay = true;
            document.body.appendChild(audio);
        };

        pc.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
            return pc.createAnswer();
        }).then(answer => {
            pc.setLocalDescription(answer);
            socket.emit('sdp-answer', answer, room);
        });
    });

    socket.on('sdp-answer', (answer, userId) => {
        peerConnections[userId].setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', (candidate) => {
        Object.values(peerConnections).forEach(pc => {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
        });
    });
};
          
