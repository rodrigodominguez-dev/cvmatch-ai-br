# CVMatch AI

> Seu currículo alinhado à vaga, sem inventar sua experiência.

Aplicação web criada no Lovable para o desafio Santander/DIO “Criando um Gerador de Currículos ATS Friendly com Lovable”.

## Aplicação publicada

[Abrir o CVMatch AI](https://cvmatch-ai-br.lovable.app/)

## Problema que resolve

O CVMatch AI compara um currículo com a descrição de uma vaga, destaca requisitos já presentes e aponta lacunas. Assim, ajuda quem procura emprego a apresentar melhor suas experiências reais. A regra principal é não inventar habilidades, experiências, tecnologias, formação, certificações, projetos ou resultados.

## Mega prompt usado e evolução

A primeira solicitação ao Lovable foi um mega prompt em Markdown que detalhava o objetivo, as telas, o fluxo, a demonstração, a identidade visual, a acessibilidade e os critérios de conclusão. Abaixo está o núcleo da versão final usada para orientar a aplicação.

~~~markdown
# CVMatch AI — comparação de currículo com vaga

Crie uma aplicação web em português que compare o currículo de uma pessoa com a descrição de uma vaga e ajude a apresentar melhor suas experiências reais.

## Regra principal

Nunca invente cargos, empresas, experiências, projetos, certificações, formação, habilidades, idiomas, tecnologias, responsabilidades ou resultados. Reorganize e melhore apenas informações presentes no currículo. Se um requisito estiver somente na vaga, marque-o como não identificado no currículo e não o acrescente como qualificação comprovada.

## Telas e fluxo

Crie uma página inicial com a proposta e ações para iniciar uma análise ou entender o funcionamento. Explique as etapas: inserir a vaga, inserir o currículo, analisar correspondências e lacunas e revisar a versão ajustada. Na tela de análise, use campos separados, instruções claras e validação compreensível. Na tela de resultado, mostre resumo do alinhamento textual, palavras-chave encontradas, requisitos não identificados, sugestões e currículo ajustado. Explique que o alinhamento não prevê contratação. Permita copiar e exportar o currículo em PDF.

## Demonstração, visual e privacidade

Use dados fictícios. O currículo de exemplo contém Python, HTML, CSS, JavaScript, Git e PostgreSQL; a vaga também pede Django, APIs REST e Docker. Marque Python, PostgreSQL e Git como encontradas e as demais como não identificadas; não inclua lacunas no currículo ajustado. Crie uma interface limpa, profissional, responsiva e acessível. Não exija cadastro nem armazene currículos em servidor sem necessidade.
~~~

### O que mudou até a versão final

- Organizamos a experiência em início, “Como funciona”, análise e resultado.
- Separamos o resultado em resumo, palavras-chave, lacunas, sugestões e currículo ajustado.
- Incluímos cópia do currículo e exportação em PDF.
- Reforçamos e conferimos a regra de não inventar competências.
- Refinamos textos e interface em português e aplicamos uma atualização de segurança de rotina nos pacotes.

## Como a análise funciona

1. A pessoa cola a descrição da vaga e o próprio currículo.
2. O aplicativo compara os textos e resume o alinhamento textual.
3. Separa palavras-chave encontradas e não identificadas.
4. Apresenta lacunas e sugestões baseadas no conteúdo informado.
5. Reorganiza o currículo sem converter lacunas em experiência.
6. Permite copiar o resultado ou exportá-lo em PDF.

O alinhamento é uma comparação textual, não uma previsão de contratação.

## Ajustes pedidos após a primeira geração

Foram refinadas a navegação e a organização do resultado; foram incluídas as ações de cópia e exportação em PDF; e os avisos contra competências inventadas foram reforçados. No exemplo fictício, Python, PostgreSQL e Git apareceram como encontradas, enquanto Django e Docker ficaram como não identificadas. O currículo ajustado não acrescentou essas competências ausentes. As mudanças melhoraram clareza e utilidade sem mudar a proposta.

## Exemplo de uso

A demonstração usou vaga e currículo fictícios. Correspondências e lacunas foram exibidas separadamente, e a versão ajustada preservou as informações do currículo. Cópia e exportação em PDF também foram conferidas.

## Links da entrega

- Aplicação publicada: [https://cvmatch-ai-br.lovable.app/](https://cvmatch-ai-br.lovable.app/)
- Repositório GitHub: [https://github.com/rodrigodominguez-dev/cvmatch-ai-br](https://github.com/rodrigodominguez-dev/cvmatch-ai-br)
