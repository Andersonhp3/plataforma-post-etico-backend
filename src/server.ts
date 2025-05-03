import Fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyPostgres from '@fastify/postgres'

import authRoutes from './routes/auth'
import perfilRoutes from './routes/perfil'
import postsRoutes from './routes/posts'

async function buildServer() {
  const server = Fastify({ logger: true })

  // 1) CORS – permite chamadas do front em http://localhost:5000
  await server.register(fastifyCors, {
    origin: ['http://localhost:5000'],
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })

  // 2) Banco de dados – PostgreSQL
  //    Ajuste o connectionString conforme seu .env
  await server.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  })

  // 3) JWT – para autenticação
  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
  })

  // 4) Decorator para extrair o user do token
  server.decorate(
    'verifyJWT',
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  )

  // 5) Rotas
  await server.register(authRoutes,   { prefix: '/api/v1/auth'   })
  await server.register(perfilRoutes, { prefix: '/api/v1'         })
  await server.register(postsRoutes,  { prefix: '/api/v1'         })

  return server
}

async function start() {
  try {
    const server = await buildServer()
    const port = Number(process.env.PORT) || 3000
    await server.listen({ port, host: '0.0.0.0' })
    server.log.info(`Servidor rodando em http://localhost:${port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
