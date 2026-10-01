export const SITE_URL = "https://cvmatch-ai-br.lovable.app";
export const SITE_NAME = "CVMatch AI";

type PageMeta = {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: object[];
};

/** Monta head() com título, descrição, canonical, Open Graph, Twitter e JSON-LD. */
export function pageHead({ path, title, description, type = "website", noindex, jsonLd }: PageMeta) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: (jsonLd ?? []).map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify(data),
    })),
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Análise de currículo para vagas de tecnologia",
  operatingSystem: "Qualquer navegador moderno",
  inLanguage: "pt-BR",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
  description:
    "Aplicação web que compara o currículo com uma vaga de tecnologia (desenvolvimento, dados, QA e infraestrutura), mostra palavras-chave encontradas e não identificadas, sugere melhorias e gera uma versão ajustada sem inventar experiências. Não prevê resultado de processo seletivo.",
  featureList: [
    "Comparação textual entre currículo e descrição da vaga",
    "Palavras-chave encontradas com trecho do currículo como evidência",
    "Lista de tecnologias e requisitos não identificados no currículo",
    "Sugestões de melhoria baseadas apenas no conteúdo existente",
    "Currículo ajustado exportável em DOCX editável, PDF ou texto",
    "Histórico salvo apenas no navegador, sem login",
  ],
};
