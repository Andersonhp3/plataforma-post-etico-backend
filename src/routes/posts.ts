import { FastifyInstance } from 'fastify';
import { generatePost } from '../services/openai';
import { checkEthics } from '../services/ethicsCheck';
import { authenticate } from '../middlewares/auth.middleware';

export default async function postsRoutes(server: FastifyInstance) {
  // Rota protegida - criação de posts
  server.post('/posts', { preValidation: [authenticate] }, async (request, reply) => {
    const { especialidade, tipo } = request.body as { especialidade: string; tipo: string };
    const userId = request.user.id;

    const texto = await generatePost(especialidade, tipo);
    const violacoes = checkEthics(texto);

    const { rows } = await server.pg.query(
      `INSERT INTO posts (especialidade, tipo, texto, violacoes, usuario_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [especialidade, tipo, texto, violacoes, userId]
    );

    return rows[0];
  });

  // Rota protegida - listagem de posts do usuário
  server.get('/posts', { preValidation: [authenticate] }, async (request) => {
    const userId = request.user.id;
    const { rows } = await server.pg.query(
      `SELECT * FROM posts WHERE usuario_id = $1 ORDER BY criado_em DESC`,
      [userId]
    );
    return rows;
  });
}
