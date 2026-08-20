const { getRedisClient } = require('../config/redis');
const { notifyDonors } = require('./notificationService');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

let Queue, Worker;
try {
  ({ Queue, Worker } = require('bullmq'));
} catch (e) {
  console.warn('[Queue] bullmq not available');
}

const QUEUE_NAME = 'notification-queue';
let notificationQueue = null;

/**
 * Initialize the BullMQ queue. Returns null if Redis is unavailable.
 */
const initQueue = () => {
  const redis = getRedisClient();
  if (!redis || !Queue) return null;

  notificationQueue = new Queue(QUEUE_NAME, { connection: redis });
  console.log('[Queue] BullMQ notification queue initialized');
  return notificationQueue;
};

/**
 * Push a notification job to BullMQ queue.
 * Falls back to synchronous notification if queue unavailable.
 */
const enqueueNotification = async ({ requestId, donorIds }) => {
  if (!notificationQueue) {
    // Synchronous fallback
    console.log('[Queue] No queue — running notifications synchronously');
    await processNotificationJob({ requestId, donorIds });
    return;
  }

  await notificationQueue.add(
    'notify-donors',
    { requestId, donorIds },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  );
  console.log(`[Queue] Job enqueued for request ${requestId} with ${donorIds.length} donors`);
};

/**
 * Core job processor — used by both the worker and the synchronous fallback.
 */
const processNotificationJob = async ({ requestId, donorIds }) => {
  try {
    const [request, donors] = await Promise.all([
      BloodRequest.findById(requestId),
      User.find({ _id: { $in: donorIds } }).select('name phone email fcmToken bloodGroup'),
    ]);

    if (!request) {
      console.warn(`[Queue] Request ${requestId} not found`);
      return;
    }

    await notifyDonors({ donors, request });
    console.log(`[Queue] Job done: notified ${donors.length} donors for request ${requestId}`);
  } catch (err) {
    console.error('[Queue] Job failed:', err.message);
    throw err; // Let BullMQ retry
  }
};

/**
 * Start the BullMQ worker. Called from server.js.
 */
const startWorker = () => {
  const redis = getRedisClient();
  if (!redis || !Worker) {
    console.warn('[Queue] Worker not started — Redis unavailable');
    return null;
  }

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      console.log(`[Worker] Processing job ${job.id}: ${job.name}`);
      await processNotificationJob(job.data);
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on('completed', (job) => console.log(`[Worker] Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`[Worker] Job ${job.id} failed:`, err.message));

  console.log('[Worker] BullMQ worker started');
  return worker;
};

module.exports = { initQueue, enqueueNotification, startWorker };
