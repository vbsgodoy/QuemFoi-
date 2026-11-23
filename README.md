# QuemFoi? · Amigo secreto

Site para organizar amigos secretos: crie um grupo, chame a turma por link de convite
(ou cadastre os nomes você mesmo), defina regras e faça o sorteio. Cada pessoa recebe
um link pessoal e vê só quem tirou.

Feito com **Next.js** + **Supabase**, publicado na **Vercel**.

## Rodando localmente

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. No painel do Supabase, abra **SQL Editor**, cole o conteúdo de
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) e rode.
3. Copie `.env.example` para `.env.local` e preencha com os dados de
   **Project Settings → API** (URL e chave `service_role`).
4. Rode:

   ```bash
   npm install
   npm run dev
   ```

   e abra http://localhost:3000.

## Publicando na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe este repositório.
2. Em **Environment Variables**, adicione as mesmas variáveis do `.env.example`
   (`NEXT_PUBLIC_SITE_URL` com o endereço final do site).
3. Clique em **Deploy**. A cada merge na `main` o site é atualizado.

## Como o acesso funciona

Não há login. O organizador recebe um link de administração secreto, e cada
participante recebe um link pessoal secreto. Todas as consultas ao banco passam
pelo servidor com a chave `service_role`; o banco tem RLS ligado sem políticas
públicas, então nada fica exposto pelo navegador.

## Roteiro

- [x] Passo 1: base do projeto e esquema do banco
- [ ] Passo 2: grupos, convites, regras e sorteio
- [ ] Passo 3: lista de desejos, valor, mensagens anônimas e envio por WhatsApp/e-mail
- [ ] Passo 4: acabamento visual, testes e publicação final
