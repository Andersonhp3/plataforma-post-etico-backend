import 'fastify'
import { FastifyJWT } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    user: FastifyJWT['user']  // <- Aqui você está dizendo para o TypeScript: "vai ter user sim!"
  }
}

