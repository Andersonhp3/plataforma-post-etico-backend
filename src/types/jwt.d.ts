import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; email: string };  // Tipo completo do payload
    user: { id: number; email: string };     // Tipo completo do request.user
  }
}