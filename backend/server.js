require('dotenv').config();
const path = require('path');

const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const bookRoutes = require('./routes/bookRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');
const exportRoutes = require('./routes/exportRoutes.js');
const app = express();

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET","PUT","POST","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

connectDB();
app.use(express.json());


// static folder for uploads
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});