import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';

export async function autenticarUsuario(
    fastify: FastifyInstance,
    email: string,
    senha: string
) {
    const { rows } = await fastify.pg.query(
        'SELECT id, email, senha_hash FROM usuarios WHERE email = $1',
        [email]
    );

    if (!rows.length) throw new Error('Email não encontrado');

    const senhaValida = await bcrypt.compare(senha, rows[0].senha_hash);
    if (!senhaValida) throw new Error('Senha incorreta');

    // Gera token apenas com o ID (ou adicione email se necessário)
    const token = fastify.jwt.sign({
        id: rows[0].id
    });

    return { token, usuario: { id: rows[0].id, email: rows[0].email } };
}