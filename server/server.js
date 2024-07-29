const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

app.use(cors());
let chatHistory = [];


io.on('connection', (socket) => {
  console.log('a user connected');

  // Send chat history to newly connected clients
  socket.emit('chat history', chatHistory);

  // Listen for chat messages
  socket.on('chat message', (msg) => {
      const message = { id: 'user', text: msg };
      chatHistory.push(message);
      io.emit('chat message', message);
  });

  // Listen for system responses
  socket.on('system response', (msg) => {
      const response = { id: 'system', text: `System response: ${msg}` };
      chatHistory.push(response);
      io.emit('chat message', response);
  });

  // Handle clearing the chat
  socket.on('clear chat', () => {
      chatHistory = [];
      io.emit('chat history', chatHistory);
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

app.get("/api/featuredProducts", (req, res) => {
  const products = [
    {
      name: "Brand New Phones",
      description: "Innovation at Your Fingertips!",
      image: "images/phone.jpg",
    },
    {
      name: "Smart Watches",
      description: "Your Health, Your Time, Your Way!",
      image: "/images/smartwatch.jpg",
    },
    {
      name: "Ear Buds",
      description: "Hear the Difference, Feel the Beat!",
      image: "/images/headset.jpg",
    },
  ];
  res.json(products);
});

app.get("/api/items", (req, res) => {
  const items = [
    {
      name: "Smartphone X",
      image: "/images/phoneItem.jpg",
      details:
        "The Smartphone X is designed with cutting-edge technology to keep you connected, entertained, and productive.",
      features: [
        "6.5-inch OLED display",
        "Triple-lens camera system",
        "5G connectivity",
        "128GB storage",
      ],
      benefits: [
        "Stunning visuals with vibrant colors",
        "Capture professional-quality photos",
        "Blazing fast internet speeds",
        "Plenty of space for all your apps and media",
      ],
      uniqueSellingPoints: [
        "Ultra-fast processor",
        "All-day battery life",
        "Seamless integration with all your devices",
      ],
    },
    {
      name: "Laptop Pro",
      image: "images/laptop.jpg",
      details:
        "The Laptop Pro offers unparalleled performance and portability, perfect for both work and play.",
      features: [
        "15.6-inch Retina display",
        "Intel i7 processor",
        "16GB RAM",
        "1TB SSD",
      ],
      benefits: [
        "Crisp and clear display for all your work and play",
        "Powerful performance for multitasking",
        "Smooth and efficient operation",
        "Ample storage for all your files",
      ],
      uniqueSellingPoints: [
        "Sleek and lightweight design",
        "Long battery life",
        "Advanced security features",
      ],
    },
    {
      name: "Wireless Earbuds",
      image: "images/earpod.jpg",
      details:
        "Experience superior sound quality and comfort with our Wireless Earbuds, perfect for music and calls.",
      features: [
        "Noise-canceling technology",
        "Bluetooth 5.0",
        "20-hour battery life",
        "Built-in microphone",
      ],
      benefits: [
        "Enjoy your music without distractions",
        "Stable and quick wireless connection",
        "Listen all day on a single charge",
        "Crystal-clear voice calls",
      ],
      uniqueSellingPoints: [
        "Comfortable in-ear design",
        "Fast charging",
        "Voice assistant compatibility",
      ],
    },
  ];
  res.json(items);
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));