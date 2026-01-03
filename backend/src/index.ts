import Fastify from 'fastify';
import { userRoutes } from './routes/users.routes';

const fastify = Fastify({
  logger: true,
});

// Register routes
fastify.register(async function (fastify) {
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', message: 'Backend is running' };
  });
});

// Register user routes
fastify.register(userRoutes);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Backend server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

