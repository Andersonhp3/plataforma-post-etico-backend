import { FastifyRequest, FastifyReply } from 'fastify';
import { FastifyJWT } from '@fastify/jwt';

type AuthenticatedRequest = FastifyRequest & { user: FastifyJWT['user'] };

export async function authenticated(request: AuthenticatedRequest, reply: FastifyReply) {
  try {
      await request.jwtVerify(); // Note the correct method name is jwtVerify, not jwtverify
      // request.user will now be available with proper typing
  } catch (err) {
      reply.status(401).send({ error: 'Token inválido ou ausente' });
  }
}