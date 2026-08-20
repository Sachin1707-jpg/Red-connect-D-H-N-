require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initQueue, startWorker } = require('./services/queueWorker');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect MongoDB
  await connectDB();

  // Init BullMQ Queue & Worker
  initQueue();
  startWorker();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/health`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err) => {
    console.error('[Server] Unhandled Rejection:', err.message);
  });

  process.on('uncaughtException', (err) => {
    console.error('[Server] Uncaught Exception:', err.message);
    process.exit(1);
  });
};

startServer();
