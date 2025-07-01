import { useState, useEffect, useRef } from 'react';

const WEBSOCKET_URL = import.meta.env.VITE_API_URL || 'ws://localhost:8080';

function Chat() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');

    const ws = useRef(null);
    const chatEndRef = useRef(null);


    // Effect to scroll to the bottom of the chat window when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isLoggedIn) {
            ws.current = new WebSocket(WEBSOCKET_URL);
            // console.log(ws.current);

            ws.current.onopen = () => console.log('WebSocket connected', username);
            ws.current.onclose = () => console.log('WebSocket disconnected');

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'history') {
                    setMessages(data.payload);
                } else if (data.type === 'message') {
                    setMessages((prevMessages) => [...prevMessages, data.payload]);
                }
            };

            ws.current.onerror = (error) => console.error('WebSocket error:', error);

            return () => {
                if (ws.current) ws.current.close();
            };
        }
    }, [isLoggedIn]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setIsLoggedIn(true);
            setError('');
        }else{
            setError('username cannot be empty.');
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
            const messagePayload = {
                username: username,
                message: newMessage,
            };
            ws.current.send(JSON.stringify(messagePayload));
            setNewMessage('');
        }
    };

    const handleLogout = () => {
        if (ws.current) {
            ws.current.close();
        }
        setIsLoggedIn(false);
        setUsername('');
        setMessages([]);
    }

    // The Login View
    if (!isLoggedIn) {
        return (
            <div className="bg-gray-100 flex items-center justify-center h-screen">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Join a Chatroom</h1>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    {
                        error &&
                        <div className='text-sm text-red-500'>{error}
                        </div>
                    }
                    <button
                        type="submit"
                        className="w-full mt-4 p-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Join
                    </button>
                </form>
            </div>
        );
    }

    // The Chat View
    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center h-screen">
            <div className='w-full text-right mr-5 p-2 text-red-500 font-bold text-sm'><span className='cursor-pointer' onClick={handleLogout}>Logout</span></div>
            <div className="bg-white w-full max-w-3xl h-[90vh] rounded-2xl shadow-2xl flex flex-col">
                {/* Chat Window */}
                <div className="flex-grow p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.username == username ? 'items-end' : 'items-start'}`}>
                                <span className="font-bold text-sm text-gray-600">{msg.username}</span>
                                <div className="mt-1 bg-gray-200 text-gray-800 p-3 rounded-lg max-w-md shadow-sm">
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                        {/* Empty div to which we'll scroll */}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Message Input Form */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-full flex-shrink-0 shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {/* Simple Send SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;