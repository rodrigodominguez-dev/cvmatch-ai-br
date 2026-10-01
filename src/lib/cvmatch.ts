export type KeywordFound = { termo: string; trecho: string };
export type KeywordPossible = { termo: string; observacao: string };
export type KeywordMissing = { termo: string };
export type Suggestion = { o_que: string; por_que: string; como: string };

export type Analysis = {
  vaga_titulo: string | null;
  alinhamento: number;
  encontradas: KeywordFound[];
  possiveis: KeywordPossible[];
  nao_identificadas: KeywordMissing[];
  sugestoes: Suggestion[];
};

export type ResumeExperience = {
  cargo: string;
  empresa: string;
  periodo: string;
  descricao: string[];
};
export type ResumeEducation = { curso: string; instituicao: string; periodo: string };
export type ResumeProject = { nome: string; descricao: string };

export type AdjustedResume = {
  nome: string | null;
  contato: string | null;
  resumo: string | null;
  experiencias: ResumeExperience[];
  formacao: ResumeEducation[];
  competencias: string[];
  certificacoes: string[];
  idiomas: string[];
  projetos: ResumeProject[];
};

export type StoredAnalysis = {
  id: string;
  criadoEm: string;
  vaga: string;
  curriculo: string;
  analise: Analysis;
  curriculoAjustado: AdjustedResume | null;
};

export type HistoryEntry = {
  id: string;
  criadoEm: string;
  vagaTitulo: string;
  alinhamento: number;
};

export const MIN_LENGTH = 180;

export const AVISO_INDICADOR =
  "Esse indicador representa a correspondência textual entre os conteúdos analisados e não prevê o resultado do processo seletivo.";

export const ERRO_CAMPOS_VAZIOS =
  "Insira a descrição da vaga e o currículo para iniciar a análise.";
export const ERRO_CONTEUDO_CURTO =
  "O conteúdo informado parece incompleto. Insira uma descrição mais completa da vaga e/ou currículo.";

const CURRENT_KEY = "cvmatch:atual";
const HISTORY_KEY = "cvmatch:historico";

export function saveCurrent(entry: StoredAnalysis) {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(entry));
  } catch {
    /* storage indisponível */
  }
}

export function loadCurrent(): StoredAnalysis | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as StoredAnalysis) : null;
  } catch {
    return null;
  }
}

export function clearCurrent() {
  try {
    localStorage.removeItem(CURRENT_KEY);
  } catch {
    /* noop */
  }
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry) {
  try {
    const list = [entry, ...loadHistory().filter((h) => h.id !== entry.id)].slice(0, 8);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    /* noop */
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* noop */
  }
}

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function resumeToText(r: AdjustedResume): string {
  const parts: string[] = [];
  if (r.nome) parts.push(r.nome.toUpperCase());
  if (r.contato) parts.push(r.contato);
  if (r.resumo) parts.push(`\nRESUMO PROFISSIONAL\n${r.resumo}`);
  if (r.experiencias.length) {
    parts.push("\nEXPERIÊNCIA PROFISSIONAL");
    for (const e of r.experiencias) {
      parts.push(
        `${[e.cargo, e.empresa].filter(Boolean).join(" — ")}${e.periodo ? ` (${e.periodo})` : ""}`,
      );
      for (const d of e.descricao) parts.push(`- ${d}`);
    }
  }
  if (r.formacao.length) {
    parts.push("\nFORMAÇÃO ACADÊMICA");
    for (const f of r.formacao) {
      parts.push(
        `${[f.curso, f.instituicao].filter(Boolean).join(" — ")}${f.periodo ? ` (${f.periodo})` : ""}`,
      );
    }
  }
  if (r.competencias.length) parts.push(`\nCOMPETÊNCIAS\n${r.competencias.join(", ")}`);
  if (r.certificacoes.length) parts.push(`\nCERTIFICAÇÕES\n${r.certificacoes.join("\n")}`);
  if (r.idiomas.length) parts.push(`\nIDIOMAS\n${r.idiomas.join(", ")}`);
  if (r.projetos.length) {
    parts.push("\nPROJETOS");
    for (const p of r.projetos) parts.push(`${p.nome}: ${p.descricao}`);
  }
  return parts.join("\n");
}

export const DEMO_VAGA = `Desenvolvedor(a) Python Júnior — Empresa fictícia Nova Rota Tecnologia (dados de demonstração)

Atuação no desenvolvimento e manutenção de aplicações web e integrações internas.

Requisitos:
- Python
- Django
- PostgreSQL
- Git e versionamento de código
- Construção e consumo de APIs REST
- Docker para ambientes de desenvolvimento

Desejável:
- Noções de testes automatizados
- Inglês para leitura de documentação`;

export const DEMO_CURRICULO = `Ana Exemplo da Silva (perfil fictício para demonstração)
São Paulo, SP | ana.exemplo@email.ficticio | (11) 90000-0000

Resumo
Pessoa desenvolvedora em início de carreira, com formação em Análise e Desenvolvimento de Sistemas e projetos acadêmicos em desenvolvimento web.

Experiência
Estagiária de Desenvolvimento — Empresa fictícia Luz Digital (2024 - 2025)
- Apoio na manutenção de páginas internas em HTML, CSS e JavaScript
- Correção de rotinas em Python para tratamento de planilhas
- Consultas e ajustes em banco de dados PostgreSQL
- Uso diário de Git para versionamento

Formação
Análise e Desenvolvimento de Sistemas — Faculdade fictícia Horizonte (2022 - 2024)

Competências
Python, HTML, CSS, JavaScript, Git, PostgreSQL`;
