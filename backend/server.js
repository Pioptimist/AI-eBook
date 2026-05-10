require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const client = require('prom-client'); 
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const bookRoutes = require('./routes/bookRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');
const exportRoutes = require('./routes/exportRoutes.js');

const app = express();

// --- 2. SETUP PROMETHEUS METRICS ---
// Enable default system metrics (CPU, RAM, Node event loop)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// Create a custom metric to track API traffic
const totalRequestsCounter = new client.Counter({
  name: 'app_total_requests',
  help: 'Total number of HTTP requests made to the API'
});
// -----------------------------------

app.use(cors({
    origin: "*",
    methods: ["GET","PUT","POST","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));


app.use(express.json());

// --- 3. METRICS MIDDLEWARE ---
// This runs on EVERY request before it hits your routes
app.use((req, res, next) => {
  // Pro-tip: Do not count the /metrics route itself!
  // Prometheus will ping this route every 5 seconds. If we count it, 
  // it will ruin our traffic data with fake "ghost" requests.
  if (req.path !== '/metrics') {
    totalRequestsCounter.inc(); 
  }
  next();
});

// --- 4. EXPOSE THE DATA ---
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get("/", (req, res)=>{
    res.status(200).json({msg: "api is up and running"})
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});