import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';

interface UsuarioDB {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
}

export async function getPerfil(
  fastify: FastifyInstance,
  userId: number
) {
  const { rows } = await fastify.pg.query<{
    id: number
    nome: string
    email: string
    especialidade: string | null
    criado_em: string | null
  }>(
    `SELECT id, nome, email, especialidade, criado_em
     FROM usuarios
     WHERE id = $1`,
    [userId]
  );
  if (rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }
  const row = rows[0];
  return {
    id: row.id,
    name: row.nome,
    email: row.email,
    specialty: row.especialidade,
    createdAt: row.criado_em,
  };
}

export async function updatePerfil(
  fastify: FastifyInstance,
  userId: number,
  data: { name: string; specialty?: string }
) {
  const { name, specialty } = data;
  const { rows } = await fastify.pg.query<{
    id: number
    nome: string
    email: string
    especialidade: string | null
  }>(
    `UPDATE usuarios
     SET nome = $1,
         especialidade = $2
     WHERE id = $3
     RETURNING id, nome, email, especialidade`,
    [name, specialty || null, userId]
  );
  if (rows.length === 0) {
    throw new Error('Falha ao atualizar perfil');
  }
  const row = rows[0];
  return {
    id: row.id,
    name: row.nome,
    email: row.email,
    specialty: row.especialidade,
  }
}

// Exportação explícita da função registrarUsuario
export async function registrarUsuario(
  fastify: FastifyInstance,
  dados: { nome: string; email: string; senha: string; especialidade: string }
) {
  const senha_hash = await bcrypt.hash(dados.senha, 10);

  const { rows } = await fastify.pg.query<UsuarioDB>(
    `INSERT INTO usuarios (nome, email, senha_hash, especialidade)
     VALUES ($1, $2, $3, $4) 
     RETURNING id, nome, email, especialidade`,
    [dados.nome, dados.email, senha_hash, dados.especialidade]
  );

  return rows[0];
}

// Exportação explícita da função autenticarUsuario
export async function autenticarUsuario(
  fastify: FastifyInstance,
  email: string,
  senha: string
) {
  const { rows } = await fastify.pg.query<UsuarioDB>(
    'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1',
    [email]
  );

  if (!rows.length) throw new Error('Email não encontrado');

  const usuario = rows[0];
  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) throw new Error('Senha incorreta');


  const tokenPayload = {
    id: usuario.id,
    email: usuario.email  // Agora compatível com a declaração
  };
  const token = fastify.jwt.sign(tokenPayload);

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  };
}