import { FastifyInstance } from 'fastify';
import { createUserSchema, getUserSchema } from '../schemas/user.schema';

export async function userRoutes(fastify: FastifyInstance) {
  // Create user endpoint with Zod validation
  fastify.post('/users', async (request, reply) => {
    const validatedData = createUserSchema.parse(request.body);
    
    // In a real app, you would save to database here
    const newUser = {
      id: crypto.randomUUID(),
      ...validatedData,
      createdAt: new Date(),
    };

    return reply.code(201).send(newUser);
  });

  // Get user by ID with Zod validation
  fastify.get('/users/:id', async (request, reply) => {
    const { id } = getUserSchema.parse({ id: (request.params as { id: string }).id });
    
    // In a real app, you would fetch from database here
    const user = {
      id,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    };

    return user;
  });
}

