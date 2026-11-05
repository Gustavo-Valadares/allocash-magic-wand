import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, History, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/estatisticas")({
  head: () => ({
    meta: [
      { title: "Estatísticas — Allocash" },
      { name: "description", content: "Histórico de registros e estatísticas das suas reservas." },
      { property: "og:title", content: "Estatísticas — Allocash" },
      { property: "og:description", content: "Histórico de registros e estatísticas das suas reservas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Stats,
});

// Dados fictícios (mock)
const mockFilters = [
  { name: "Mensal Padrão", reserves: [{ name: "Investimentos", pct: 35 }, { name: "Moradia", pct: 30 }, { name: "Lazer", pct: 15 }, { name: "Emergência", pct: 20 }] },
  { name: "Férias 2026", reserves: [{ name: "Viagem", pct: 45 }, { name: "Hospedagem", pct: 25 }, { name: "Passeios", pct: 18 }, { name: "Extras", pct: 12 }] },
];

const mockHistory = [
  { date: "05/11/2026", filter: "Mensal Padrão", capital: 5200 },
  { date: "05/10/2026", filter: "Mensal Padrão", capital: 4850 },
  { date: "20/09/2026", filter: "Férias 2026", capital: 3100 },
  { date: "05/09/2026", filter: "Mensal Padrão", capital: 4700 },
  { date: "05/08/2026", filter: "Mensal Padrão", capital: 4500 },
];

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Stats() {
  const total = mockHistory.reduce((s, h) => s + h.capital, 0);
  const avg = total / mockHistory.length;
  const max = Math.max(...mockHistory.map((h) => h.capital));

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Estatísticas</h1>
        <span className="text-xs text-muted-foreground">(dados de exemplo)</span>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          ["Total distribuído", brl(total)],
          ["Média por registro", brl(avg)],
          ["Maior capital", brl(max)],
          ["Registros", String(mockHistory.length)],
        ].map(([l, v]) => (
          <Card key={l}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{l}</p>
            <p className="text-lg font-semibold">{v}</p>
          </CardContent></Card>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4" /> Filtros de reservas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockFilters.map((f) => (
            <Card key={f.name}>
              <CardHeader className="pb-2"><CardTitle className="text-base">{f.name}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {f.reserves.map((r) => (
                  <div key={r.name} className="space-y-1">
                    <div className="flex justify-between text-sm"><span>{r.name}</span><span className="text-primary font-medium">{r.pct}%</span></div>
                    <Progress value={r.pct} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Histórico</h2>
        <Card><CardContent className="p-0 divide-y">
          {mockHistory.map((h) => (
            <div key={h.date} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium">{h.filter}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-semibold">{brl(h.capital)}</span>
              </div>
            </div>
          ))}
        </CardContent></Card>
      </section>
    </main>
  );
}
