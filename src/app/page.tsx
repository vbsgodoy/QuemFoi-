const recursos = [
  {
    titulo: "Cada um se cadastra",
    texto: "Compartilhe um link de convite ou adicione os nomes você mesmo.",
  },
  {
    titulo: "Regras do sorteio",
    texto: "Casais que não se tiram, exclusões de um lado só e regras próprias do grupo.",
  },
  {
    titulo: "Resultado secreto",
    texto: "Cada pessoa recebe um link pessoal e vê só quem tirou.",
  },
  {
    titulo: "Lista de desejos e mensagens",
    texto: "Dicas de presente, valor sugerido e conversa anônima com seu amigo secreto.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">QuemFoi?</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Amigo secreto sem papelzinho.
        </h1>
        <p className="text-lg text-muted">
          Crie um grupo, chame a turma e faça o sorteio em poucos cliques. Serve para família,
          amigos, trabalho, ou qualquer ocasião.
        </p>
        <div>
          <span className="inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white opacity-60">
            Criar grupo (em breve)
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {recursos.map((r) => (
          <div key={r.titulo} className="rounded-2xl border border-black/10 p-5 dark:border-white/15">
            <h2 className="font-semibold">{r.titulo}</h2>
            <p className="mt-1 text-sm text-muted">{r.texto}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
