const express = require('express');
var http = require('http');
const { SocketAddress } = require('net');
const app = express();
const port = process.env.PORT || 8000;
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
let AllOffer = {};
let candidate = [];

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// let remoteStream;

let senderStream = new wrtc.MediaStream();

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

        // roomId = data.roomId;

        const host = new wrtc.RTCPeerConnection(configuration);

        //socket.emit("room_created",1);

        socket.on('offer', async function(offer) {
            //console.log(offer, 'offer');

            host.setRemoteDescription(new wrtc.RTCSessionDescription(offer));
            const answer = await host.createAnswer();
            await host.setLocalDescription(answer);
            socket.emit('answer', answer);
            // host.ontrack = (e) => handleTrackEvent(e,host);
            // AllOffer[1] = offer;
            // socket.emit("req_offer",offer);
        });

        host.addEventListener('icecandidate', (event) => {
            if (event.candidate) {
                socket.emit('server_ice_candidate', event.candidate);
            }
        });

        socket.on('client_ice_candidate', async(data) => {
            console.log('.............candidate', data);
            //socket.emit('req_ice_candidate', data);

            if (data) {
                try {
                    await host.addIceCandidate(data);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        });

        host.ontrack = (e) => {
            console.log("tracks comming in host");
            e.streams[0].getTracks().forEach((track) => {
                senderStream.addTrack(track);
            });
        };

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
        //

        // console.log(senderStream, 'senderStream');

        // socket.emit('room_id', data.roomId);
        // roomId = data.roomId;

        // socket.broadcast.to(data.roomId).emit('created', `$(data.name) created room`);

        //socket.broadcast.to(data.roomId).emit('message', 'A new user has joined');
    });

    socket.on('join_room', async(data) => {
        console.log(data, 'join_room');
        const peerConnection = new wrtc.RTCPeerConnection(configuration);

        socket.on('offer', async(offer) => {
            console.log(offer, 'offer.............. join room');

            peerConnection.setRemoteDescription(new wrtc.RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            console.log('ans............jr', answer);
            await peerConnection.setLocalDescription(answer);
            socket.emit('answer', answer);
        });

        peerConnection.addEventListener('icecandidate', (event) => {
            // console.log(event.candidate,'candidates got.........');

            if (event.candidate) {
                socket.emit('server_ice_candidate', event.candidate);
            }
        });

        socket.on('client_ice_candidate', async(data) => {
            console.log('candiate......jr......', data);

            if (data) {
                try {
                    await peerConnection.addIceCandidate(data);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        });

        senderStream.getTracks().forEach((track) => {
            console.log(track, '===track===');
            peerConnection.addTrack(track, senderStream);
        });

        //  socket.on("send_answer",data=>{
        // 	socket.emit("answer",data);

        // });

        // socket.on("mem_client_ice_candidate",data=>{
        // 	socket.on("mem_ice_candidate",data);
        // })

        socket.join(data.roomId);

        socket.broadcast.to(data.roomId).emit('joined', `${data.name} joined room`);

        // let localSteam;

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
        // // });

        console.log(senderStream, 'senderstream');

        // socket.emit('room_id', data.roomId);
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

function handleTrackEvent(e, host) {
    console.log(e, 'hte e');
    senderStream = e.streams[0];

    console.log(senderStream, 'sendersStream');

    senderStream.getTracks().forEach((track) => {
        console.log('tek', track);
    });
}

console.log('yaha aya');
server.listen(port, '0.0.0.0', () => {
    console.log(`server started on ${port}`);
});
