import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { breadcrumb, pageHead } from "@/lib/seo";

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

export const Route = createFileRoute("/como-funciona")({
  head: () =>
    pageHead({
      path: "/como-funciona",
      title: "Como funciona — CVMatch AI para vagas de tecnologia",
      description:
        "Os quatro passos da análise de currículo para vagas de tecnologia, os limites do indicador de alinhamento e a regra de nunca inventar experiência.",
      type: "article",
      jsonLd: [
        breadcrumb([
          { name: "Início", path: "/" },
          { name: "Como funciona", path: "/como-funciona" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Como alinhar seu currículo a uma vaga de tecnologia com o CVMatch AI",
          inLanguage: "pt-BR",
          step: passos.map(([name, text], i) => ({ "@type": "HowToStep", position: i + 1, name, text })),
        },
      ],
    }),
  component: ComoFunciona,
});


function ComoFunciona() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Como funciona</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          O CVMatch AI compara o texto da vaga com o texto do seu currículo e mostra onde os dois
          conversam — e onde não conversam. Ele foi pensado para vagas de desenvolvimento, dados, QA
          e infraestrutura, mas não presume sua senioridade nem quais tecnologias você domina: só
          considera o que está escrito.
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
            Limites do resultado
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            O “alinhamento identificado” mede apenas a correspondência textual entre vaga e currículo.
            Ele não prevê aprovação, não garante entrevista ou emprego e não representa posição em
            nenhum ranking. O currículo ajustado pode ser baixado em Word (.docx) editável, PDF ou
            copiado como texto — revise sempre antes de enviar.
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
