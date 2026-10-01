# CVMatch AI

> Seu currículo alinhado à vaga, sem inventar sua experiência.

Aplicação web em português criada no Lovable para o desafio Santander/DIO “Criando um Gerador de Currículos ATS Friendly com Lovable”.

- Aplicação publicada: https://cvmatch-ai-br.lovable.app/
- Repositório: https://github.com/rodrigodominguez-dev/cvmatch-ai-br

## Problema que resolve

Candidatos nem sempre conseguem identificar quais requisitos da vaga já aparecem no currículo e quais ainda não estão comprovados. O CVMatch AI compara os dois textos, organiza correspondências e lacunas e sugere formas de apresentar melhor a experiência real. Sua regra principal é não inventar habilidades, tecnologias, experiências, formação, certificações, projetos ou resultados.

## Mega prompt enviado ao Lovable

A primeira solicitação foi um documento Markdown de 583 linhas anexado no Lovable. Ele especificou produto, telas, fluxo, análise, conteúdo de demonstração, acessibilidade, privacidade, critérios de sucesso e estilo visual. Abaixo está a especificação central usada para gerar o app:

~~~markdown
# CVMatch AI — gerador de currículos ATS Friendly

Crie uma aplicação web chamada CVMatch AI com a tagline “Seu currículo alinhado à vaga, sem inventar sua experiência”. Ajude quem procura emprego a comparar seu currículo com uma vaga e a apresentar melhor suas experiências reais.

## Objetivo e regra principal

Permita colar a descrição da vaga e o currículo, analisar os conteúdos, mostrar alinhamento textual, palavras-chave encontradas e não identificadas, sugestões e uma versão ajustada do currículo pronta para copiar ou exportar em PDF.

Nunca invente experiências, cargos, empresas, projetos, certificações, formação, habilidades, resultados, idiomas, tecnologias ou responsabilidades. Reorganize e melhore somente informações existentes. Uma competência que aparece na vaga mas não é comprovada no currículo deve ser mostrada como “Não identificada no currículo” e nunca afirmada como verdadeira.

Exemplo: se a vaga pede Python e Django e o currículo comprova Python, mostre Python como encontrada e Django como não identificada. Não declare experiência com Django só porque consta na vaga.

## Telas e fluxo

Não exija login no MVP. Crie uma página inicial que explique a proposta e ofereça ações para analisar o currículo e entender como funciona. Mostre quatro etapas: colar a vaga, colar o currículo, analisar correspondências e lacunas, e ajustar o conteúdo preservando a verdade.

Na tela de análise, apresente dois campos grandes, um para descrição da vaga e outro para o currículo, com instruções claras e ação para analisar. Valide os campos e informe estados de carregamento e erro de forma compreensível.

Analise tecnologias, ferramentas, conhecimentos, competências, cargos, metodologias, idiomas, certificações, formação e responsabilidades. Separe o resultado em palavras-chave encontradas, não identificadas e possíveis correspondências. Não trate palavras genéricas como requisitos relevantes.

Na tela de resultados, mostre um resumo, alinhamento textual, palavras-chave, lacunas, sugestões e currículo ajustado. Deixe claro que o alinhamento compara textos e não prevê contratação. Baseie as sugestões exclusivamente nas informações fornecidas e explique o que melhorar, por que e como poderia ficar.

O currículo ajustado pode melhorar estrutura, clareza, organização e redação, mas não pode converter uma lacuna em qualificação afirmada. Mostre apenas seções com conteúdo existente no currículo original. Inclua opções de copiar o currículo e exportar PDF funcionando no navegador.

## Demonstração, privacidade e visual

Use um exemplo fictício de Desenvolvedor Python Júnior. O currículo inclui Python, HTML, CSS, JavaScript, Git e PostgreSQL; a vaga pede também Django, APIs REST e Docker. O resultado deve marcar Python, PostgreSQL e Git como encontradas, e Django, APIs REST e Docker como não identificadas, sem adicioná-las ao currículo.

Informe que os textos são usados para gerar a análise e que a pessoa é responsável pelo que inserir. Não inclua dados de terceiros, chaves ou tokens; não armazene currículos em servidor sem necessidade.

Crie uma interface profissional, limpa, responsiva e acessível: bastante espaço em branco, cards com bordas suaves, tipografia legível, componentes consistentes, foco visível e navegação por teclado. Use azul escuro para textos, azul para ações, branco e cinza claro nas superfícies, verde para confirmações, amarelo para atenção e vermelho apenas para alertas. No celular, empilhe os campos.

## Critério de sucesso

A pessoa consegue entender a proposta, informar vaga e currículo, analisar correspondências e lacunas, receber sugestões, gerar uma versão ajustada sem competências inventadas e exportar o resultado.
~~~

## Como a análise funciona

1. A pessoa cola a vaga e o próprio currículo.
2. O aplicativo compara os textos e resume o alinhamento.
3. As palavras-chave aparecem como encontradas ou não identificadas.
4. O resultado reúne sugestões baseadas no currículo informado.
5. A pessoa gera e revisa o currículo ajustado, que não incorpora itens ausentes.
6. O currículo pode ser copiado ou exportado em PDF.

## Ajustes após a primeira geração

- Refinamos a experiência em português com páginas de Início, Como funciona, análise e resultado.
- Organizamos o resultado nas seções Resumo, Palavras-chave, Lacunas, Sugestões e Currículo ajustado.
- Incluímos cópia do currículo e exportação em PDF.
- Tornamos explícita a regra de não inventar competências e conferimos o exemplo de teste: Python, PostgreSQL e Git encontradas; Django e Docker não identificadas.
- Aplicamos uma atualização de segurança de rotina nos pacotes.

Os ajustes priorizaram o fluxo principal e a regra de veracidade sem alterar a proposta do produto.

## Evidência de uso

No exemplo de teste, Django e Docker permaneceram como lacunas e não foram incluídos no currículo ajustado. A cópia e a exportação em PDF também foram verificadas. A aplicação publicada está disponível no link acima.

## Desenvolvimento

O projeto foi criado e sincronizado pelo Lovable. A estrutura inclui TypeScript, CSS e configuração Bun. Consulte package.json e bun.lock para os detalhes de dependências e scripts de execução. Não versione chaves, tokens ou senhas.
