import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ClipboardPaste, FileText, Search, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CVMatch AI — Seu currículo alinhado à vaga" },
      {
        name: "description",
        content:
          "Compare seu currículo com uma vaga, veja palavras-chave encontradas e lacunas, receba sugestões e gere uma versão ajustada — sem inventar experiência.",
      },
      { property: "og:title", content: "CVMatch AI — Seu currículo alinhado à vaga" },
      {
        property: "og:description",
        content:
          "Compare currículo e vaga, identifique lacunas e gere uma versão mais alinhada ao processo seletivo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
              Compare seu currículo com uma vaga, descubra quais palavras-chave estão presentes,
              identifique lacunas e gere uma versão mais alinhada ao processo seletivo.
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
            qualificações que não estejam comprovadas no seu currículo.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
