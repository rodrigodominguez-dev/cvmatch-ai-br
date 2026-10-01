# CVMatch AI — currículo alinhado à vaga

Aplicação em português que compara o currículo do usuário com uma descrição de vaga, mostra palavras-chave encontradas e lacunas, sugere melhorias e gera uma versão ajustada do currículo — sem nunca inventar experiência.

## Páginas

1. **Início (/)** — hero "CVMatch AI / Seu currículo alinhado à vaga, sem inventar sua experiência", botões "Analisar meu currículo" e "Como funciona", seção de 4 passos e destaque "Não inventamos sua experiência".
2. **Como funciona (/como-funciona)** — explicação dos 4 passos, a regra de não inventar nada e aviso de privacidade.
3. **Analisar (/analisar)** — dois campos grandes (vaga e currículo) com rótulos, contador de caracteres, botão "Carregar exemplo" com dados fictícios, aviso sobre usar informações verdadeiras, e o botão "Analisar currículo".
4. **Resultado (/resultado)** — abas: Resumo, Palavras-chave, Lacunas, Sugestões, Currículo ajustado. Botão "Nova análise".

## O que a análise entrega

- **Resumo:** total de palavras-chave, quantas encontradas, quantas não identificadas, número de sugestões e "Alinhamento identificado: X%" com a nota de que é correspondência textual, não previsão de contratação.
- **Encontradas:** cada termo com o trecho do currículo onde aparece.
- **Possíveis correspondências:** termos parecidos, marcados como a confirmar.
- **Não identificadas:** cada termo com "Não identificada no currículo" e a orientação de só incluir se for verdade.
- **Sugestões:** cada uma com "O que melhorar", "Por que" e "Como poderia ficar".
- **Currículo ajustado:** gerado sob demanda pelo botão "Gerar currículo ajustado", exibido em formato profissional (nome, contato, resumo, experiência, formação, competências, certificações, idiomas, projetos — só as seções que existirem).

## Exportação e histórico

- "Exportar currículo" gera um PDF direto no navegador (impressão formatada), e "Copiar currículo" copia o texto.
- Histórico das análises recentes salvo apenas no navegador: data, nome da vaga quando identificado e o alinhamento. Com opção de limpar.

## Visual

Clean e profissional: azul escuro para texto, azul para ações, fundo cinza bem claro, cards de bordas suaves, verde para positivo, amarelo para atenção, vermelho só para alertas. Responsivo, com os campos empilhados no celular, rótulos acessíveis e foco visível.

## Estados e erros

Aguardando dados, "Comparando seu currículo com a vaga..." durante a análise, concluído e erro. Campos vazios: "Insira a descrição da vaga e o currículo para iniciar a análise." Conteúdo curto demais: "O conteúdo informado parece incompleto...". Nenhuma mensagem técnica aparece para o usuário.

## Detalhes técnicos

- Ativar o Lovable Cloud para rodar a análise no servidor (a chave de IA nunca vai para o navegador). Sem login, sem banco de dados.
- Duas funções de servidor: `analisarCurriculo` (palavras-chave, correspondências, lacunas, sugestões, alinhamento) e `gerarCurriculoAjustado`, ambas com saída estruturada e prompt que proíbe explicitamente inventar qualquer informação e exige que todo termo "encontrado" cite um trecho literal do currículo.
- Modelo `openai/gpt-6-astra` via Lovable AI Gateway, chamadas em streaming, com tratamento de limite de uso e falhas traduzido em mensagens simples.
- Validação de tamanho mínimo e filtro de termos genéricos ("empresa", "equipe", "experiência") feito no cliente antes de enviar.
- Resultado e histórico guardados em `localStorage`; nada é persistido em servidor.
- Rotas TanStack com `head()` próprio em cada página (título, descrição, og).
