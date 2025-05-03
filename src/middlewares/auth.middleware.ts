// import { FastifyRequest, FastifyReply } from 'fastify';

// export async function verificarToken(request: FastifyRequest, reply: FastifyReply) {
//   try {
//     await request.jwtVerify<{ id: number; email: string }>(); // Tipo explícito
//   } catch (err) {
//     reply.status(401).send({ error: 'Token inválido' });
//   }
// }
import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ erro: 'Token inválido ou ausente' });
  }
}