import type { AdjustedResume } from "./cvmatch";

/**
 * Gera um .docx editável e compatível com ATS inteiramente no navegador:
 * uma coluna, sem tabelas, imagens ou caixas de texto, fonte padrão (Arial),
 * títulos de seção simples e listas nativas do Word.
 */
export async function downloadResumeDocx(r: AdjustedResume) {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    LevelFormat,
    Packer,
    Paragraph,
    TextRun,
  } = await import("docx");

  const children: InstanceType<typeof Paragraph>[] = [];

  const section = (titulo: string) =>
    children.push(
      new Paragraph({
        spacing: { before: 240, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 1 } },
        children: [new TextRun({ text: titulo.toUpperCase(), bold: true, size: 24 })],
      }),
    );
  const text = (t: string, opts: { bold?: boolean; italics?: boolean } = {}) =>
    children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: t, ...opts })] }));
  const bullet = (t: string) =>
    children.push(
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun(t)] }),
    );

  if (r.nome)
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: r.nome, bold: true, size: 32 })],
      }),
    );
  if (r.contato) text(r.contato);

  if (r.resumo) {
    section("Resumo profissional");
    text(r.resumo);
  }
  if (r.experiencias.length) {
    section("Experiência profissional");
    for (const e of r.experiencias) {
      text([e.cargo, e.empresa].filter(Boolean).join(" — "), { bold: true });
      if (e.periodo) text(e.periodo, { italics: true });
      for (const d of e.descricao) bullet(d);
    }
  }
  if (r.formacao.length) {
    section("Formação acadêmica");
    for (const f of r.formacao)
      text(
        `${[f.curso, f.instituicao].filter(Boolean).join(" — ")}${f.periodo ? ` (${f.periodo})` : ""}`,
      );
  }
  if (r.competencias.length) {
    section("Competências técnicas");
    text(r.competencias.join(", "));
  }
  if (r.certificacoes.length) {
    section("Certificações");
    for (const c of r.certificacoes) bullet(c);
  }
  if (r.idiomas.length) {
    section("Idiomas");
    text(r.idiomas.join(", "));
  }
  if (r.projetos.length) {
    section("Projetos");
    for (const p of r.projetos) {
      text(p.nome, { bold: true });
      text(p.descricao);
    }
  }

  const doc = new Document({
    creator: "CVMatch AI",
    title: r.nome ? `Currículo — ${r.nome}` : "Currículo",
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const nomeArquivo =
    "curriculo-" +
    (r.nome ?? "ajustado")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    ".docx";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
