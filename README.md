# QuemFoi? · Amigo secreto

Site para organizar amigos secretos: crie um grupo, chame a turma por link de convite
(ou cadastre os nomes você mesmo), defina regras e faça o sorteio. Cada pessoa recebe
um link pessoal e vê só quem tirou.

Feito com **Next.js** (site estático) + **Firebase** (Firestore e login anônimo),
publicado de graça no **GitHub Pages**.

## Configurando o Firebase (uma vez)

1. Crie um projeto grátis em [console.firebase.google.com](https://console.firebase.google.com)
   (o plano gratuito Spark basta).
2. **Build → Authentication → Começar**, e ative o provedor **Anônimo**.
3. **Build → Firestore Database → Criar banco de dados**, modo de produção
   (região `southamerica-east1` se quiser São Paulo).
4. Na aba **Regras** do Firestore, cole o conteúdo de [`firestore.rules`](firestore.rules) e publique.
5. Em **Configurações do projeto → Seus apps**, adicione um app **Web** (`</>`).
   Guarde os valores `apiKey`, `authDomain`, `projectId` e `appId`.
6. Em **Authentication → Configurações → Domínios autorizados**, adicione
   `SEU-USUARIO.github.io`.

## Publicando no GitHub Pages (uma vez)

1. No repositório, **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Secrets and variables → Actions → aba Variables**, crie:
   `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID`
   com os valores do passo 5 acima.
3. A cada merge na `main`, o site é publicado em
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Rodando localmente

```bash
cp .env.example .env.local   # preencha com os valores do app web
npm install
npm run dev
```

Testes das regras de segurança (precisa de Java instalado):

```bash
npm run test:rules
```

## Como o acesso funciona

Não há cadastro com senha. Cada navegador entra com login anônimo do Firebase.
O organizador recebe um link secreto de administração e cada participante um link
pessoal secreto; abrir o link prova ao Firebase que a pessoa tem aquele acesso.
As regras em [`firestore.rules`](firestore.rules) garantem que cada um veja só o que
é seu (por exemplo, só você vê quem tirou), e os testes em
[`tests/`](tests/firestore.rules.test.mjs) verificam isso. O modelo de dados está em
[`src/lib/db/schema.ts`](src/lib/db/schema.ts).

Como o sorteio é feito no navegador do organizador, quem organiza tecnicamente
poderia descobrir o resultado. O site não mostra isso a ninguém.

## Roteiro

- [x] Passo 1: base do projeto e esquema do banco
- [ ] Passo 2: grupos, convites, regras e sorteio
- [ ] Passo 3: lista de desejos, valor, mensagens anônimas e envio por WhatsApp/e-mail
- [ ] Passo 4: acabamento visual, testes e publicação final
