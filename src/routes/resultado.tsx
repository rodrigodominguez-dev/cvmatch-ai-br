import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Copy, Download, FileText, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { pageHead } from "@/lib/seo";
import { ResumeView } from "@/components/resume-view";
import { gerarCurriculoAjustado } from "@/lib/cvmatch.functions";
import {
  AVISO_INDICADOR,
  clearCurrent,
  loadCurrent,
  resumeToText,
  saveCurrent,
  type StoredAnalysis,
} from "@/lib/cvmatch";

export const Route = createFileRoute("/resultado")({
  head: () =>
    pageHead({
      path: "/resultado",
      title: "Resultado da análise — CVMatch AI",
      description:
        "Alinhamento textual, palavras-chave encontradas e não identificadas, sugestões e currículo ajustado para exportar em Word, PDF ou texto.",
      noindex: true,
    }),
  component: Resultado,
});

const abas = ["Resumo", "Palavras-chave", "Lacunas", "Sugestões", "Currículo ajustado"] as const;
type Aba = (typeof abas)[number];

function Resultado() {
  const navigate = useNavigate();
  const gerar = useServerFn(gerarCurriculoAjustado);
  const [dados, setDados] = useState<StoredAnalysis | null>(null);
  const [pronto, setPronto] = useState(false);
  const [aba, setAba] = useState<Aba>("Resumo");
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setDados(loadCurrent());
    setPronto(true);
  }, []);

  if (!pronto) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-5xl px-4 py-20 text-sm text-muted-foreground">
          Carregando...
        </div>
      </SiteShell>
    );
  }

  if (!dados) {
    return (
      <SiteShell>
        <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Nenhuma análise encontrada
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Aguardando dados: cole uma vaga e um currículo para começar.
          </p>
          <Link
            to="/analisar"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Iniciar análise
          </Link>
        </div>
      </SiteShell>
    );
  }

  const a = dados.analise;
  const total = a.encontradas.length + a.possiveis.length + a.nao_identificadas.length;

  async function onGerar() {
    if (!dados || gerando) return;
    setGerando(true);
    setErro(null);
    try {
      const resultado = await gerar({
        data: { vaga: dados.vaga, curriculo: dados.curriculo },
      });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      const atualizado = { ...dados, curriculoAjustado: resultado.curriculo };
      setDados(atualizado);
      saveCurrent(atualizado);
    } catch {
      setErro("Não foi possível gerar o currículo ajustado agora. Tente novamente.");
    } finally {
      setGerando(false);
    }
  }

  async function onDocx() {
    if (!dados?.curriculoAjustado) return;
    try {
      const { downloadResumeDocx } = await import("@/lib/resume-docx");
      await downloadResumeDocx(dados.curriculoAjustado);
    } catch {
      setErro("Não foi possível gerar o arquivo Word agora. Tente novamente.");
    }
  }

  async function onCopiar() {
    if (!dados?.curriculoAjustado) return;
    try {
      await navigator.clipboard.writeText(resumeToText(dados.curriculoAjustado));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setErro("Não foi possível copiar o texto no seu navegador.");
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Resultado da análise
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {a.vaga_titulo?.trim() || "Vaga sem título identificado"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearCurrent();
              void navigate({ to: "/analisar" });
            }}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <RotateCcw className="size-4" aria-hidden />
            Nova análise
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Seções do resultado"
          className="mt-8 flex flex-wrap gap-2 border-b border-border pb-px print:hidden"
        >
          {abas.map((item) => (
            <button
              key={item}
              role="tab"
              type="button"
              aria-selected={aba === item}
              onClick={() => setAba(item)}
              className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                aba === item
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {aba === "Resumo" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Palavras-chave identificadas" value={total} />
                <Stat label="Encontradas" value={a.encontradas.length} tone="good" />
                <Stat label="Não identificadas" value={a.nao_identificadas.length} tone="warn" />
                <Stat label="Sugestões" value={a.sugestoes.length} />
              </div>

              <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <p className="text-lg font-semibold text-foreground">
                  Alinhamento identificado: {a.alinhamento}%
                </p>
                <div
                  className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={a.alinhamento}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Alinhamento textual identificado"
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, Math.max(0, a.alinhamento))}%` }}
                  />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {AVISO_INDICADOR}
                </p>
              </div>
            </div>
          )}

          {aba === "Palavras-chave" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Palavras-chave encontradas
                </h2>
                {a.encontradas.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Nenhum termo da vaga foi identificado no currículo.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {a.encontradas.map((k, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-[color:var(--success-border)] bg-[color:var(--success-soft)] p-4"
                      >
                        <span className="inline-flex rounded-full bg-[color:var(--success)] px-3 py-1 text-xs font-semibold text-[color:var(--success-contrast)]">
                          {k.termo}
                        </span>
                        {k.trecho && (
                          <p className="mt-3 text-sm leading-relaxed text-foreground italic">
                            “{k.trecho}”
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {a.possiveis.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Possíveis correspondências
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {a.possiveis.map((k, i) => (
                      <li key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                          {k.termo}
                        </span>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {k.observacao}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {aba === "Lacunas" && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Palavras-chave não identificadas
              </h2>
              {a.nao_identificadas.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Todos os termos relevantes da vaga foram localizados no currículo.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {a.nao_identificadas.map((k, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-[color:var(--warning-border)] bg-[color:var(--warning-soft)] p-4"
                    >
                      <p className="font-semibold text-foreground">{k.termo}</p>
                      <p className="mt-1 text-sm text-[color:var(--warning-foreground)]">
                        Não identificada no currículo.
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground shadow-sm">
                Se você realmente possui essa experiência, considere descrevê-la de forma mais
                clara. Caso não possua, não adicione essa informação apenas para atender à vaga.
              </p>
            </section>
          )}

          {aba === "Sugestões" && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Como melhorar seu currículo
              </h2>
              <ul className="mt-4 space-y-4">
                {a.sugestoes.map((s, i) => (
                  <li key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-foreground">{s.o_que}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">Por que melhorar: </span>
                      {s.por_que}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">Como poderia ficar: </span>
                      {s.como}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {aba === "Currículo ajustado" && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Currículo ajustado
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                A versão ajustada usa apenas as informações do seu currículo original. Nada do que
                está na lista de lacunas é adicionado.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 print:hidden">
                <button
                  type="button"
                  onClick={onGerar}
                  disabled={gerando}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
                >
                  {gerando ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Sparkles className="size-4" aria-hidden />
                  )}
                  {dados.curriculoAjustado ? "Gerar novamente" : "Gerar currículo ajustado"}
                </button>
                {dados.curriculoAjustado && (
                  <>
                    <button
                      type="button"
                      onClick={onDocx}
                      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      <FileText className="size-4" aria-hidden />
                      Baixar Word (.docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      <Download className="size-4" aria-hidden />
                      Exportar currículo (PDF)
                    </button>
                    <button
                      type="button"
                      onClick={onCopiar}
                      className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {copiado ? (
                        <Check className="size-4" aria-hidden />
                      ) : (
                        <Copy className="size-4" aria-hidden />
                      )}
                      {copiado ? "Copiado" : "Copiar currículo"}
                    </button>
                  </>
                )}
              </div>

              {gerando && (
                <p
                  role="status"
                  className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-accent px-4 py-3 text-sm font-medium text-foreground"
                >
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Reorganizando seu currículo com base na vaga...
                </p>
              )}

              {dados.curriculoAjustado && (
                <div className="mt-8">
                  <ResumeView resume={dados.curriculoAjustado} />
                </div>
              )}
            </section>
          )}
        </div>

        {erro && (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive print:hidden"
          >
            {erro}
          </p>
        )}
      </div>
    </SiteShell>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "text-[color:var(--success)]"
      : tone === "warn"
        ? "text-[color:var(--warning-foreground)]"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className={`text-3xl font-semibold ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
