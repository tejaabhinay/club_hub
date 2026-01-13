const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const Club = require('./models/Club');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (clubId) => {
        socket.join(clubId);
        console.log(`User with ID: ${socket.id} joined room: ${clubId}`);
    });

    socket.on('send_message', async (data) => {
        const { senderId, clubId, content, senderName } = data;

        // Security Check: Verify user is a member of the club
        try {
            const club = await Club.findById(clubId);
            if (!club) return;

            const isMember = club.members.includes(senderId) || 
                             club.head.toString() === senderId || 
                             club.coordinators.includes(senderId);

            if (isMember) {
                const newMessage = new Message({
                    sender: senderId,
                    content: content,
                    clubId: clubId
                });

                await newMessage.save();

                io.to(clubId).emit('receive_message', {
                    content,
                    senderName,
                    senderId,
                    timestamp: new Date()
                });
            } else {
                console.log('User not authorized to send message to this club');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
