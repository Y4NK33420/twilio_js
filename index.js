// filepath: /d:/gigs/Twilio 11Labs Agent/test-ngrok/yt/elevenlabs-twilio-ai-caller/twilio_js/index.js
import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import { registerInboundRoutes } from './inbound-calls.js';
import { registerOutboundRoutes } from './outbound-calls.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Initialize Fastify server
const fastify = Fastify({
  logger: true // Enable logging
});

fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

const PORT = process.env.PORT || 8000;

// Root route for health check
fastify.get("/", async (_, reply) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, '../index.html');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  reply.type('text/html').send(fileContent);
});

// Start the Fastify server
const start = async () => {
  try {
    // Register route handlers
    await registerInboundRoutes(fastify);
    await registerOutboundRoutes(fastify);

    // Start listening
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[Server] Listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

start();