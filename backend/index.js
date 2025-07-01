
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Message = require('./models/message.model');
const connectDB = require('./config/dbConnect'); 

dotenv.config();

// --- Basic Server Setup ---
const app = express();
app.use(cors());
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// --- Database Connection ---
connectDB();

// --- WebSocket Server Setup ---
const wss = new WebSocketServer({ server });

wss.on('connection', async (ws) => {
    console.log('Client connected');

    // 1. When a client connects, send them the recent chat history
    try {
        const messages = await Message.find().sort({ timestamp: -1 }).limit(50).exec();
        // The messages are sorted newest to oldest, so reverse for display
        ws.send(JSON.stringify({ type: 'history', payload: messages.reverse() }));
    } catch (err) {
        console.error('Error fetching message history:', err);
    }

    // 2. Handle messages received from a client
    ws.on('message', async (data) => {
        try {
            const messageData = JSON.parse(data);
            
            // Save the new message to the database
            const newMessage = new Message({
                username: messageData.username,
                message: messageData.message,
            });
            const savedMessage = await newMessage.save();

            // Broadcast the new message to all connected clients
            const broadcastData = JSON.stringify({ type: 'message', payload: savedMessage });
            
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(broadcastData);
                }
            });

        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    // 3. Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

app.get('/', (req, res) => {
    res.send('WebSocket server for Shared ChatRoom is running');
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!' + err.message);
});

// --- Start the Server ---
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});