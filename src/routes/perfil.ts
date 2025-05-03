// src/routes/perfil.ts
import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getPerfil,
  updatePerfil
} from '../services/auth.service';

export default async function perfilRoutes(server: FastifyInstance) {
  // GET /api/v1/perfil
  server.get(
    '/perfil',
    { preValidation: [authenticate] },
    async (request, reply) => {
      const userId = (request.user as { id: number }).id;
      const perfil = await getPerfil(server, userId);
      return reply.send(perfil);
    }
  );

  // PUT /api/v1/perfil
  server.put(
    '/perfil',
    { preValidation: [authenticate] },
    async (request, reply) => {
      const userId = (request.user as { id: number }).id;
      const body = request.body as {
        name: string;
        specialty?: string;
      };
      const updated = await updatePerfil(server, userId, body);
      return reply.send(updated);
    }
  );
}
