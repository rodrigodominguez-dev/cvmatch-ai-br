import type { AdjustedResume } from "@/lib/cvmatch";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h3 className="border-b border-border pb-1 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
        {title}
      </h3>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">{children}</div>
    </section>
  );
}

export function ResumeView({ resume }: { resume: AdjustedResume }) {
  return (
    <article
      id="curriculo-ajustado"
      className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      {(resume.nome || resume.contato) && (
        <header className="border-b border-border pb-4">
          {resume.nome && (
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{resume.nome}</h2>
          )}
          {resume.contato && (
            <p className="mt-1 text-sm text-muted-foreground">{resume.contato}</p>
          )}
        </header>
      )}

      {resume.resumo && (
        <Section title="Resumo profissional">
          <p>{resume.resumo}</p>
        </Section>
      )}

      {resume.experiencias.length > 0 && (
        <Section title="Experiência profissional">
          {resume.experiencias.map((exp, i) => (
            <div key={i}>
              <p className="font-semibold text-foreground">
                {[exp.cargo, exp.empresa].filter(Boolean).join(" — ")}
              </p>
              {exp.periodo && <p className="text-xs text-muted-foreground">{exp.periodo}</p>}
              {exp.descricao.length > 0 && (
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {exp.descricao.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.formacao.length > 0 && (
        <Section title="Formação acadêmica">
          {resume.formacao.map((f, i) => (
            <div key={i}>
              <p className="font-semibold text-foreground">
                {[f.curso, f.instituicao].filter(Boolean).join(" — ")}
              </p>
              {f.periodo && <p className="text-xs text-muted-foreground">{f.periodo}</p>}
            </div>
          ))}
        </Section>
      )}

      {resume.competencias.length > 0 && (
        <Section title="Competências">
          <p>{resume.competencias.join(" · ")}</p>
        </Section>
      )}

      {resume.certificacoes.length > 0 && (
        <Section title="Certificações">
          <ul className="list-disc space-y-1 pl-5">
            {resume.certificacoes.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Section>
      )}

      {resume.idiomas.length > 0 && (
        <Section title="Idiomas">
          <p>{resume.idiomas.join(" · ")}</p>
        </Section>
      )}

      {resume.projetos.length > 0 && (
        <Section title="Projetos">
          {resume.projetos.map((p, i) => (
            <div key={i}>
              <p className="font-semibold text-foreground">{p.nome}</p>
              <p>{p.descricao}</p>
            </div>
          ))}
        </Section>
      )}
    </article>
  );
}
