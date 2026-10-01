import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { analisarCurriculo } from "@/lib/cvmatch.functions";
import { breadcrumb, pageHead } from "@/lib/seo";
import {
  EXEMPLOS,
  ERRO_CAMPOS_VAZIOS,
  ERRO_CONTEUDO_CURTO,
  MIN_LENGTH,
  clearHistory,
  formatDate,
  loadHistory,
  pushHistory,
  saveCurrent,
  type HistoryEntry,
} from "@/lib/cvmatch";

export const Route = createFileRoute("/analisar")({
  head: () =>
    pageHead({
      path: "/analisar",
      title: "Analisar currículo para vaga de tecnologia — CVMatch AI",
      description:
        "Cole uma vaga de desenvolvimento, dados, QA ou infraestrutura e seu currículo para ver tecnologias encontradas, não identificadas e sugestões baseadas só na sua experiência real.",
      jsonLd: [
        breadcrumb([
          { name: "Início", path: "/" },
          { name: "Analisar currículo", path: "/analisar" },
        ]),
      ],
    }),
  component: Analisar,
});

function Analisar() {
  const navigate = useNavigate();
  const analisar = useServerFn(analisarCurriculo);
  const [vaga, setVaga] = useState("");
  const [curriculo, setCurriculo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [historico, setHistorico] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistorico(loadHistory());
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (carregando) return;
    const v = vaga.trim();
    const c = curriculo.trim();

    if (!v || !c) {
      setErro(ERRO_CAMPOS_VAZIOS);
      return;
    }
    if (v.length < MIN_LENGTH || c.length < MIN_LENGTH) {
      setErro(ERRO_CONTEUDO_CURTO);
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      const resultado = await analisar({ data: { vaga: v, curriculo: c } });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      const id = `${Date.now()}`;
      const criadoEm = new Date().toISOString();
      saveCurrent({
        id,
        criadoEm,
        vaga: v,
        curriculo: c,
        analise: resultado.analise,
        curriculoAjustado: null,
      });
      pushHistory({
        id,
        criadoEm,
        vagaTitulo: resultado.analise.vaga_titulo?.trim() || "Vaga sem título identificado",
        alinhamento: resultado.analise.alinhamento,
      });
      await navigate({ to: "/resultado" });
    } catch {
      setErro("Não foi possível concluir a análise agora. Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Analisar currículo
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cole os dois textos abaixo. A comparação usa apenas o conteúdo que você informar.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-[color:var(--warning-border)] bg-[color:var(--warning-soft)] p-4 text-sm text-[color:var(--warning-foreground)]">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            Use informações verdadeiras. O CVMatch AI não inventa experiências ou qualificações.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
          <div className="grid gap-6 lg:grid-cols-2">
            <Field
              id="vaga"
              label="Descrição da vaga"
              placeholder="Cole aqui a descrição completa da vaga..."
              value={vaga}
              onChange={setVaga}
              disabled={carregando}
            />
            <Field
              id="curriculo"
              label="Seu currículo"
              placeholder="Cole aqui o texto do seu currículo..."
              value={curriculo}
              onChange={setCurriculo}
              disabled={carregando}
            />
          </div>

          {erro && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {erro}
            </p>
          )}

          {carregando && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-lg border border-border bg-accent px-4 py-3 text-sm font-medium text-foreground"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Comparando seu currículo com a vaga...
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={carregando}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
            >
              {carregando && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {carregando ? "Analisando..." : "Analisar currículo"}
            </button>
            <span className="text-sm text-muted-foreground">Carregar exemplo fictício:</span>
            {EXEMPLOS.map((ex) => (
              <button
                key={ex.id}
                type="button"
                disabled={carregando}
                onClick={() => {
                  setVaga(ex.vaga);
                  setCurriculo(ex.curriculo);
                  setErro(null);
                }}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
              >
                {ex.area}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Funciona melhor com vagas de desenvolvimento, dados, QA e infraestrutura. Os exemplos
            usam pessoas e empresas fictícias.
          </p>
        </form>

        {historico.length > 0 && (
          <section className="mt-14">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Análises recentes
              </h2>
              <button
                type="button"
                onClick={() => {
                  clearHistory();
                  setHistorico([]);
                }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Trash2 className="size-4" aria-hidden />
                Limpar histórico
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Guardadas apenas neste navegador.
            </p>
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {historico.map((h) => (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{h.vagaTitulo}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(h.criadoEm)}</p>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">
                    Alinhamento {h.alinhamento}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </SiteShell>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        className="mt-2 min-h-56 w-full resize-y rounded-xl border border-input bg-card p-4 text-sm leading-relaxed text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-70"
      />
      <span className="mt-2 text-xs text-muted-foreground">{value.length} caracteres</span>
    </div>
  );
}
