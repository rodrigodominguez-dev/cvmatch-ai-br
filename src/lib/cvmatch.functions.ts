import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AdjustedResume, Analysis } from "./cvmatch";

const inputSchema = z.object({
  vaga: z.string().min(50).max(20000),
  curriculo: z.string().min(50).max(20000),
});

const REGRA = `Você é um analista de currículos em português do Brasil.

REGRA ABSOLUTA: nunca invente, suponha ou acrescente qualquer informação que não esteja escrita no currículo fornecido — nada de experiências, cargos, empresas, projetos, certificações, formações, habilidades, resultados, idiomas, tecnologias ou responsabilidades.
Você pode apenas reorganizar, reescrever com mais clareza, destacar e aproximar a terminologia do currículo à da vaga quando isso for verdadeiro segundo o próprio texto do currículo.
Ignore termos genéricos como "empresa", "trabalho", "equipe", "experiência", "profissional" como se fossem palavras-chave.
Escreva tudo em português do Brasil.`;

const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "vaga_titulo",
    "alinhamento",
    "encontradas",
    "possiveis",
    "nao_identificadas",
    "sugestoes",
  ],
  properties: {
    vaga_titulo: {
      type: ["string", "null"],
      description: "Título da vaga, se identificável no texto",
    },
    alinhamento: {
      type: "integer",
      description: "Percentual de correspondência textual de 0 a 100",
    },
    encontradas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["termo", "trecho"],
        properties: {
          termo: { type: "string" },
          trecho: {
            type: "string",
            description: "Trecho literal copiado do currículo onde o termo aparece",
          },
        },
      },
    },
    possiveis: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["termo", "observacao"],
        properties: {
          termo: { type: "string" },
          observacao: { type: "string" },
        },
      },
    },
    nao_identificadas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["termo"],
        properties: { termo: { type: "string" } },
      },
    },
    sugestoes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["o_que", "por_que", "como"],
        properties: {
          o_que: { type: "string" },
          por_que: { type: "string" },
          como: { type: "string" },
        },
      },
    },
  },
};

const resumeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "nome",
    "contato",
    "resumo",
    "experiencias",
    "formacao",
    "competencias",
    "certificacoes",
    "idiomas",
    "projetos",
  ],
  properties: {
    nome: { type: ["string", "null"] },
    contato: { type: ["string", "null"] },
    resumo: { type: ["string", "null"] },
    experiencias: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["cargo", "empresa", "periodo", "descricao"],
        properties: {
          cargo: { type: "string" },
          empresa: { type: "string" },
          periodo: { type: "string" },
          descricao: { type: "array", items: { type: "string" } },
        },
      },
    },
    formacao: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["curso", "instituicao", "periodo"],
        properties: {
          curso: { type: "string" },
          instituicao: { type: "string" },
          periodo: { type: "string" },
        },
      },
    },
    competencias: { type: "array", items: { type: "string" } },
    certificacoes: { type: "array", items: { type: "string" } },
    idiomas: { type: "array", items: { type: "string" } },
    projetos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["nome", "descricao"],
        properties: { nome: { type: "string" }, descricao: { type: "string" } },
      },
    },
  },
};

export const analisarCurriculo = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ ok: true; analise: Analysis } | { ok: false; erro: string }> => {
    const { generateJson, AiFriendlyError } = await import("./ai-gateway.server");
    try {
      const analise = await generateJson<Analysis>({
        schemaName: "analise_curriculo",
        schema: analysisJsonSchema,
        instructions: `${REGRA}

Sua tarefa: comparar a descrição da vaga com o currículo.
- "encontradas": termos relevantes da vaga que aparecem (de forma literal ou claramente equivalente) no currículo. Para cada um, copie um trecho literal do currículo como prova.
- "possiveis": termos da vaga que podem ter correspondência indireta no currículo, explicando a dúvida em "observacao".
- "nao_identificadas": termos relevantes da vaga sem nenhuma evidência no currículo.
- "sugestoes": entre 4 e 7 sugestões de melhoria baseadas somente no que já existe no currículo, cada uma com o que melhorar, por que e como poderia ficar.
- "alinhamento": inteiro de 0 a 100 representando a correspondência textual.`,
        input: `=== DESCRIÇÃO DA VAGA ===\n${data.vaga}\n\n=== CURRÍCULO ===\n${data.curriculo}`,
      });
      return { ok: true, analise };
    } catch (error) {
      if (error instanceof AiFriendlyError) return { ok: false, erro: error.message };
      console.error("analisarCurriculo falhou", error);
      return { ok: false, erro: "Não foi possível concluir a análise. Tente novamente." };
    }
  });

export const gerarCurriculoAjustado = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(
    async ({ data }): Promise<{ ok: true; curriculo: AdjustedResume } | { ok: false; erro: string }> => {
      const { generateJson, AiFriendlyError } = await import("./ai-gateway.server");
      try {
        const curriculo = await generateJson<AdjustedResume>({
          schemaName: "curriculo_ajustado",
          schema: resumeJsonSchema,
          instructions: `${REGRA}

Sua tarefa: reescrever o currículo em uma versão mais clara, organizada e alinhada à vaga.
- Use exclusivamente informações presentes no currículo original.
- Deixe campos nulos e listas vazias quando a informação não existir no currículo; nunca preencha com algo inventado.
- Adapte o resumo profissional e as descrições de experiências reais, sem acrescentar competências ausentes.
- Use terminologia da vaga apenas quando ela descrever com fidelidade algo que já está no currículo.`,
          input: `=== DESCRIÇÃO DA VAGA ===\n${data.vaga}\n\n=== CURRÍCULO ORIGINAL ===\n${data.curriculo}`,
        });
        return { ok: true, curriculo };
      } catch (error) {
        if (error instanceof AiFriendlyError) return { ok: false, erro: error.message };
        console.error("gerarCurriculoAjustado falhou", error);
        return {
          ok: false,
          erro: "Não foi possível gerar o currículo ajustado. Tente novamente.",
        };
      }
    },
  );
