// Tipo para o corpo da requisição ao criar um post
export interface CriarPostRequest {
    especialidade: string;
    tipo: 'educativo' | 'promocional' | 'dicas'; // Exemplo de tipos de post
    texto?: string; // Opcional (gerado pela IA se não fornecido)
  }
  
  // Tipo para a resposta da API (post criado)
  export interface PostResponse {
    id: number;
    especialidade: string;
    tipo: string;
    texto: string;
    violacoes: string[]; // Palavras proibidas detectadas
    usuario_id: number;
    criado_em: Date;
  }
  
  // Tipo para o payload do JWT (relacionado ao usuário que cria posts)
  export interface UserTokenPayload {
    id: number;
    email: string;
    especialidade?: string; // Opcional (para filtros)
  }
  
  // Tipo para filtros de busca de posts
  export interface ListarPostsQuery {
    especialidade?: string;
    data_inicio?: string;
    data_fim?: string;
    usuario_id?: number;
  }