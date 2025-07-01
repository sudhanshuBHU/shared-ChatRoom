# MERN Stack Real-Time Chat Application

This is a real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and WebSockets for real-time communication. The frontend is developed with **Vite + React**, and the backend uses **Node.js**, **Express.js**, **WebSocket (`ws`)**, and **Mongoose**.

## Deployed Application

- **Frontend (Netlify):** [https://zesty-tanuki-779c55.netlify.app/](https://zesty-tanuki-779c55.netlify.app/)
- **Backend (Render):** [https://sharedchatroomapi.onrender.com](https://sharedchatroomapi.onrender.com)

To use the application, open the frontend link, enter a username, and start chatting. Open multiple tabs to simulate different users.

## Features

- Multiple users can join a shared chatroom.
- Real-time messaging using WebSockets (`ws` library).
- Messages are persisted in a MongoDB database.
- New users receive the last 50 messages upon joining.
- Simple, clean user interface built with React + Vite.
- Responsive design for desktop and mobile.

## Technical Stack

- **Frontend:** Vite, React.js, Browser WebSocket API
- **Backend:** Node.js, Express.js, WebSocket (`ws`), Mongoose
- **Database:** MongoDB Atlas
- **Deployment:** Backend on Render, Frontend on Netlify

---

## Project Architecture

### Backend

The backend is built with Node.js, Express.js, and the `ws` WebSocket library. Express serves as the HTTP server, while `ws` handles real-time communication.

- **Concurrency:** Handles multiple client connections concurrently using Node.js's asynchronous, event-driven architecture. The `ws` library's event listeners (`on('connection')`, `on('message')`) are asynchronous. All database operations use `async/await` to prevent blocking the event loop.
- **Communication:** When a client sends a message, it is saved to MongoDB and then broadcast to all connected clients via `wss.clients`.
- **Persistence:** Messages are stored in MongoDB using Mongoose models.

### Frontend

The frontend is a single-page application built with **Vite + React**.

- **State Management:** Uses React hooks (`useState`, `useRef`, `useEffect`) to manage username, connection status, message list, and the WebSocket instance.
- **Communication:** Utilizes the native `WebSocket` API to connect to the backend. The WebSocket lifecycle (connection, receiving messages, cleanup) is managed with `useEffect`.
- **Development Experience:** Vite provides fast development server and hot module replacement for efficient development.

### Assumptions & Design Choices

- **No Authentication:** Only a username is required for identification; no authentication or password is implemented.
- **Single Chatroom:** The application supports one global chatroom. Extending to multiple rooms would require additional logic.
- **Error Handling:** Basic error handling for WebSocket connections and database operations, with errors logged to the console.

---

## Local Setup and Running Instructions

### Prerequisites

- Node.js (v14 or later)
- npm
- MongoDB connection string

### 1. Clone the Repository

```bash
git clone https://github.com/sudhanshuBHU/shared-ChatRoom
cd shared-ChatRoom
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create a .env file in the /backend directory and add your variables:
# MONGODB_URI="your_mongodb_connection_string"
# PORT=8080

npm start
# The backend server will run on http://localhost:8080
```

### 3. Setup Frontend

```bash
# Open a new terminal window
cd frontend
npm install

# Create a .env file in the /frontend directory and add the backend WebSocket URL:
# VITE_API_URL=ws://localhost:8080

npm run dev
# The frontend will run on http://localhost:5173 (default Vite port)
```

---

## Author

- **Name:** Sudhanshu Shekhar
- **Email:** [sudhanshu.shekhar.bhu7@gmail.com](mailto:sudhanshu.shekhar.bhu7@gmail.com)
- **LinkedIn:** [https://www.linkedin.com/in/sudhanshu-shekhar-7979b2214/](https://www.linkedin.com/in/sudhanshu-shekhar-7979b2214/)