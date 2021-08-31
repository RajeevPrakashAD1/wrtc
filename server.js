const express = require('express');
var http = require('http');
const app = express();
const port = process.env.PORT || 6001;
var server = http.createServer(app);
// var io = require('socket.io')(server);

const io = require('socket.io')(server);
const v4 = require('uuid');
const wrtc = require('wrtc');

//middlewre
app.use(express.json());
var clients = {};

const user = {};
let roomId = 'ddfdf';

console.log('server renderd');

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// let remoteStream;

let senderStream;

//console.log('fdkjdf;ls');

io.on('connection', (socket) => {
    // const id = v4();
    // console.log('id...', id);
    console.log('connetetd..................');
    //.emit('message', { message: 'welcome', id: socket.id });

    socket.on('create_room', async(data) => {
        console.log(data, 'create_room');
        // var rooms = io.sockets.adapter.rooms;
        // let room = rooms.get(data.roomId);
        //socket.join(data.roomId);

        roomId = data.roomId;

        const peerConnection = new wrtc.RTCPeerConnection(configuration);
        let localSteam;

        socket.on('offer', async function(offer, roomId) {
            console.log(offer, 'offer');
            peerConnection.setRemoteDescription(new wrtc.RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit({ answer: answer });
        });

        // peerConnection.addEventListener('icecandidate', (event) => {
        // 	if (event.candidate) {
        // 		socket.emit('ice_candidate', event.candidate);
        // 	}
        // });

        // socket.on('iceCandidate', async (data) => {
        // 	console.log('candiate', data);

        // 	if (data) {
        // 		try {
        // 			await peerConnection.addIceCandidate(data);
        // 		} catch (e) {
        // 			console.error('Error adding received ice candidate', e);
        // 		}
        // 	}
        // });

        // peerConnection.addEventListener('track', async (event) => {
        // 	remoteStream.addTrack(event.track, remoteStream);
        // 	localSteam.addTrack(event.track, localSteam);
        // });

        // const convertedStream = remoteStream;
        // localStream.getTracks().forEach((track) => {
        // 	convertedStream.removeTrack(track);
        // });

        // convertedStream.getTracks().forEach((track) => {
        // 	peerConnection.addTrack(track, convertedStream);
        // });
        peer.ontrack = (e) => { senderStream = e.streams[0] };

        console.log(senderStream, 'senderStream');

        socket.emit('room_id', data.roomId);
        roomId = data.roomId;

        socket.broadcast.to(data.roomId).emit('created', `$(data.name) created room`);

        //socket.broadcast.to(data.roomId).emit('message', 'A new user has joined');
    });

    socket.on('join_room', async(data) => {
        console.log(data, 'join_room');

        //socket.join(data.roomId);

        socket.broadcast.to(data.roomId).emit('joined', `${data.name} joined room`);

        const peer = new wrtc.RTCPeerConnection(configuration);
        let localSteam;

        socket.on('offer', async function(offer, roomId) {
            console.log(offer, 'offer');
            peer.setRemoteDescription(new wrtc.RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit({ answer: answer });
        });

        // peerConnection.addEventListener('icecandidate', (event) => {
        // 	if (event.candidate) {
        // 		socket.emit('ice_candidate', event.candidate);
        // 	}
        // });

        // socket.on('iceCandidate', async (data) => {
        // 	console.log('candiate', data);

        // 	if (data) {
        // 		try {
        // 			await peerConnection.addIceCandidate(data);
        // 		} catch (e) {
        // 			console.error('Error adding received ice candidate', e);
        // 		}
        // 	}
        // });

        // peerConnection.addEventListener('track', async (event) => {
        // 	remoteStream.addTrack(event.track, remoteStream);
        // 	localSteam.addTrack(event.track, localSteam);
        // });

        // const convertedStream = remoteStream;
        // localStream.getTracks().forEach((track) => {
        // 	convertedStream.removeTrack(track);
        // });

        // convertedStream.getTracks().forEach((track) => {
        // 	peerConnection.addTrack(track, convertedStream);
        // });
        senderStream.getTracks().forEach((track) => peer.addTrack(track, senderStream));

        socket.emit('room_id', data.roomId);
    });

    console.log(socket.id, 'has joined...ouside');

    // socket.on('send_message', (message) => {
    // 	console.log('msg aya---(s)', roomId, message);
    // 	socket.broadcast.to(roomId).emit('room_message', message);
    // });

    socket.on('disconnect', () => {
        console.log('disonnected on user..');
    });

    // // socket.on('join_room', (data) => {
    // // 	console.log('id', roomId);

    // // 	io.to(roomId).emit('someone joined room');
    // // 	socket.emit('user_joined', `${data} joined room`);
    // // });

    // socket.on('send', (message) => {
    // 	console.log('msg send', message);
    // 	socket.broadcast.emit('recieve', { message: message, name: user[socket.id] });
    // });

    // socket.on('create_room', (data) => {
    // 	//console.log(data);
    // });
    // socket.emit('got', 'hello');
});


console.log('yaha aya..........');
server.listen(port, '0.0.0.0', () => {
    console.log(`server started on ${port}`);
});