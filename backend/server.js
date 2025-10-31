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
// tells express to parse incoming request bodies as JSON and helps router like res.body tu turn them into javascricpt object which we get like res.body.name etc


// static folder for uploads
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));
// means that now in our frontend we can access the uploaded files using /backend/uploads/<filename> this is a virtual path for client to fetch the files using the absolute path given

// __dirname gives the absolute path of the folder we are rn hat s server.js and then we join it with uploads folder ie absolute path of uploads folder

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

// these are base paths that is agar client for eg api/auth... pe request daale toh woh authroutes pe jaayega phir api/auth ke baad jo bhi hai uss hisaab se authroutes ka router uss ko handle krega

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});