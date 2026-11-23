# QuemFoi? · Amigo secreto

Site para organizar amigos secretos: crie um grupo, chame a turma por link de convite
(ou cadastre os nomes você mesmo), defina regras e faça o sorteio. Cada pessoa recebe
um link pessoal e vê só quem tirou.

Feito com **Next.js** + **Firebase (Firestore)**, publicado na **Vercel**.

## Configurando o Firebase

1. Crie um projeto grátis em [console.firebase.google.com](https://console.firebase.google.com).
2. Em **Build → Firestore Database**, clique em **Criar banco de dados**
   (modo de produção, região `southamerica-east1` se quiser São Paulo).
3. Publique as regras e índices deste repositório. Pelo terminal:

   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore --project SEU-PROJETO
   ```

   Ou cole o conteúdo de [`firestore.rules`](firestore.rules) na aba **Regras** do Firestore.
4. Em **Configurações do projeto → Contas de serviço**, clique em
   **Gerar nova chave privada** e guarde o JSON (ele é secreto).

## Rodando localmente

1. Copie `.env.example` para `.env.local` e preencha com os campos do JSON
   (`project_id`, `client_email`, `private_key`).
2. Rode:

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
pelo servidor com a conta de serviço do Firebase; as regras do Firestore bloqueiam
qualquer acesso direto pelo navegador. O modelo de dados está em
[`src/lib/db/schema.ts`](src/lib/db/schema.ts).

## Roteiro

- [x] Passo 1: base do projeto e esquema do banco
- [ ] Passo 2: grupos, convites, regras e sorteio
- [ ] Passo 3: lista de desejos, valor, mensagens anônimas e envio por WhatsApp/e-mail
- [ ] Passo 4: acabamento visual, testes e publicação final
