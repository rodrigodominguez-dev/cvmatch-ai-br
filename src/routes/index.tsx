import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ClipboardPaste, FileText, Search, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { pageHead, softwareApplicationLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      path: "/",
      title: "CVMatch AI — currículo alinhado a vagas de tecnologia",
      description:
        "Compare seu currículo com vagas de desenvolvimento, dados, QA e infraestrutura. Veja tecnologias encontradas e não identificadas e gere uma versão ajustada sem inventar experiência.",
      jsonLd: [softwareApplicationLd],
    }),
  component: Index,
});

const passos = [
  {
    icon: ClipboardPaste,
    numero: "01",
    titulo: "Cole a vaga",
    texto: "Insira a descrição completa da oportunidade.",
  },
  {
    icon: FileText,
    numero: "02",
    titulo: "Cole seu currículo",
    texto: "Use seu currículo atual como fonte de informações.",
  },
  {
    icon: Search,
    numero: "03",
    titulo: "Analise",
    texto: "O sistema compara os dois conteúdos e identifica correspondências e lacunas.",
  },
  {
    icon: Sparkles,
    numero: "04",
    titulo: "Ajuste",
    texto:
      "Gere uma versão mais clara e alinhada à vaga, preservando somente informações verdadeiras.",
  },
];

function Index() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <ShieldCheck className="size-3.5" aria-hidden /> Sem login · sem invenção de
              experiência
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              CVMatch AI
            </h1>
            <p className="mt-3 text-xl font-medium text-primary">
              Seu currículo alinhado à vaga, sem inventar sua experiência.
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Feito para vagas de tecnologia — desenvolvimento, dados, QA e infraestrutura. Compare
              seu currículo com a vaga, veja quais tecnologias e requisitos aparecem, quais não foram
              identificados e gere uma versão mais clara, exportável em Word, PDF ou texto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/analisar"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Analisar meu currículo
              </Link>
              <Link
                to="/como-funciona"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Como funciona
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Como funciona</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((p) => (
            <div key={p.numero} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                  <p.icon className="size-4" aria-hidden />
                </span>
                <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                  {p.numero}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border border-border bg-accent p-8 sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Não inventamos sua experiência.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            O CVMatch AI melhora a forma como você apresenta sua experiência, mas nunca adiciona
            qualificações que não estejam comprovadas no seu currículo. Se a vaga pede Docker e
            seu currículo não menciona Docker, ele aparece como “Não identificada no currículo” e
            fica fora da versão ajustada.
          </p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">O que o CVMatch AI faz</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Compara o texto da vaga com o texto do seu currículo.</li>
              <li>Mostra cada termo encontrado com o trecho do currículo que serve de prova.</li>
              <li>Lista linguagens, ferramentas e práticas da vaga não identificadas.</li>
              <li>Sugere como apresentar melhor o que você já fez.</li>
              <li>Gera um currículo ajustado em formato simples, legível por sistemas de triagem (ATS).</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">O que ele não faz</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Não garante entrevista, contratação ou posição em qualquer ranking.</li>
              <li>Não presume senioridade nem acrescenta tecnologias, anos de experiência ou métricas.</li>
              <li>O percentual de alinhamento é só correspondência textual, não uma previsão.</li>
              <li>Não exige login e não guarda seus textos em servidor: o histórico fica no seu navegador.</li>
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
