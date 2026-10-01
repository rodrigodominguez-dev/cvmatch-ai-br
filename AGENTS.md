<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## CVMatch AI

- Toda chamada de IA passa por `src/lib/cvmatch.functions.ts` (server functions) usando o helper `src/lib/ai-gateway.server.ts`, para que a chave do gateway nunca chegue ao navegador.
- O resultado da análise e o histórico ficam só em `localStorage` (`src/lib/cvmatch.ts`); não há banco de dados nem login no MVP.
