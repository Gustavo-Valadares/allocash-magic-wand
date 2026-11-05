import { Link } from "@tanstack/react-router";
import { Calculator, BarChart3, Wallet } from "lucide-react";

const items = [
  { to: "/", label: "Calculadora", icon: Calculator },
  { to: "/estatisticas", label: "Estatísticas", icon: BarChart3 },
] as const;

export function AppNav() {
  return (
    <>
      <nav className="hidden md:block border-b bg-background">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold">
            <Wallet className="h-5 w-5 text-primary" /> Allocash
          </div>
          <div className="flex gap-1">
            {items.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                activeProps={{ className: "bg-primary/10 !text-primary font-medium" }}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-2">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="flex flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground"
              activeProps={{ className: "!text-primary font-medium" }}
            >
              <Icon className="h-5 w-5" /> {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
