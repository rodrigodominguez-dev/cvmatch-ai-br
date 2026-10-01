import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — CVMatch AI" },
      {
        name: "description",
        content:
          "Entenda os quatro passos do CVMatch AI e a regra que impede a criação de experiências que você não tem.",
      },
      { property: "og:title", content: "Como funciona — CVMatch AI" },
      {
        property: "og:description",
        content: "Os quatro passos da análise e a regra de nunca inventar experiência.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComoFunciona,
});

const passos = [
  ["01 — Cole a vaga", "Insira a descrição completa da oportunidade."],
  ["02 — Cole seu currículo", "Use seu currículo atual como fonte de informações."],
  [
    "03 — Analise",
    "O sistema compara os dois conteúdos e identifica correspondências e lacunas.",
  ],
  [
    "04 — Ajuste",
    "Gere uma versão mais clara e alinhada à vaga, preservando somente informações verdadeiras.",
  ],
];

function ComoFunciona() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Como funciona</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          O CVMatch AI compara o texto da vaga com o texto do seu currículo e mostra onde os dois
          conversam — e onde não conversam.
        </p>

        <ol className="mt-10 space-y-4">
          {passos.map(([titulo, texto]) => (
            <li key={titulo} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-semibold text-foreground">{titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{texto}</p>
            </li>
          ))}
        </ol>

        <section className="mt-12 rounded-xl border border-border bg-accent p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            O que nunca acontece aqui
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Nenhuma experiência, cargo, empresa, projeto, certificação, formação, habilidade,
            resultado, idioma ou tecnologia é criado pelo sistema. Quando um requisito da vaga não
            aparece no seu currículo, ele é apresentado como{" "}
            <strong className="text-foreground">“Não identificada no currículo”</strong> — e não é
            incluído na versão ajustada.
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Privacidade e responsabilidade
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Não é preciso criar conta. Suas análises ficam salvas apenas no seu navegador e os
            textos são usados somente para gerar o resultado. Os exemplos exibidos no app usam dados
            fictícios. Você é responsável pela veracidade do que insere.
          </p>
          <Link
            to="/analisar"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Analisar meu currículo
          </Link>
        </section>
      </div>
    </SiteShell>
  );
}
