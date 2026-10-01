import { Link } from "@tanstack/react-router";
import { FileSearch } from "lucide-react";
import type { ReactNode } from "react";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/analisar", label: "Analisar currículo" },
  { to: "/como-funciona", label: "Como funciona" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileSearch className="size-4" aria-hidden />
            </span>
            CVMatch AI
          </Link>
          <nav aria-label="Navegação principal" className="flex items-center gap-1 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-md px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                activeProps={{ className: "bg-accent text-foreground" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            CVMatch AI — seu currículo alinhado à vaga, sem inventar sua experiência.
          </p>
          <p className="mt-2 max-w-2xl">
            Os textos que você cola ficam apenas no seu navegador e são usados somente para gerar a
            análise. Você é responsável pelas informações inseridas.
          </p>
        </div>
      </footer>
    </div>
  );
}
