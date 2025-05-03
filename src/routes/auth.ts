import { FastifyInstance } from 'fastify';
import { registrarUsuario, autenticarUsuario } from '../services/auth.service';

export default async function authRoutes(server: FastifyInstance) {
  server.post('/registrar', async (request, reply) => {
    const usuario = await registrarUsuario(server, request.body as { nome: string; email: string; senha: string, especialidade: string   });
    reply.send(usuario);
  });

  server.post('/login', async (request, reply) => {
    const { email, senha } = request.body as { email: string; senha: string };
    const { token } = await autenticarUsuario(server, email, senha);
    reply.send({ token });
  });

  server.post('/social', async (request, reply) => {
    const { email, name } = request.body as { email: string; name: string };
  
    if (!email || !name) {
      return reply.status(400).send({ erro: 'Dados incompletos' });
    }
  
    // Verifica se já existe
    const { rows } = await server.pg.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
  
    if (rows.length === 0) {
      // Cria novo usuário com especialidade padrão
      await server.pg.query(
        `INSERT INTO usuarios (nome, email, senha_hash, especialidade)
         VALUES ($1, $2, '', '')`,
        [name, email]
      );
    }
  
    return reply.send({ status: 'ok' });
  });
  
}