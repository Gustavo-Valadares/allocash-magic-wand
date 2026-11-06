import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, History, Filter, TrendingUp, Trash2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { HISTORY_KEY, loadHistory, saveHistory, type HistoryRecord } from "@/lib/history";

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

// Dados fictícios (mock) para filtros
const mockFilters = [
  { name: "Mensal Padrão", reserves: [{ name: "Investimentos", pct: 35 }, { name: "Moradia", pct: 30 }, { name: "Lazer", pct: 15 }, { name: "Emergência", pct: 20 }] },
  { name: "Férias 2026", reserves: [{ name: "Viagem", pct: 45 }, { name: "Hospedagem", pct: 25 }, { name: "Passeios", pct: 18 }, { name: "Extras", pct: 12 }] },
];

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (t: number) =>
  new Date(t).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function Stats() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [showTrash, setShowTrash] = useState(false);

  useEffect(() => {
    setRecords(loadHistory());
    const onStorage = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) setRecords(loadHistory());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = (next: HistoryRecord[]) => {
    setRecords(next);
    saveHistory(next);
  };

  const active = records.filter((r) => !r.deletedAt);
  const trashed = records.filter((r) => r.deletedAt);

  const moveToTrash = (id: string) => {
    update(records.map((r) => (r.id === id ? { ...r, deletedAt: Date.now() } : r)));
    toast("Registro movido para a Lixeira");
  };
  const restore = (id: string) => {
    update(records.map((r) => (r.id === id ? { ...r, deletedAt: undefined } : r)));
    toast.success("Registro restaurado");
  };
  const destroy = (id: string) => {
    update(records.filter((r) => r.id !== id));
    toast("Registro excluído definitivamente");
  };
  const emptyTrash = () => {
    update(records.filter((r) => !r.deletedAt));
    toast("Lixeira esvaziada");
  };

  const total = active.reduce((s, h) => s + h.capital, 0);
  const avg = active.length ? total / active.length : 0;
  const max = active.length ? Math.max(...active.map((h) => h.capital)) : 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Estatísticas</h1>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          ["Total distribuído", brl(total)],
          ["Média por registro", brl(avg)],
          ["Maior capital", brl(max)],
          ["Registros", String(active.length)],
        ].map(([l, v]) => (
          <Card key={l}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{l}</p>
            <p className="text-lg font-semibold">{v}</p>
          </CardContent></Card>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold flex items-center gap-2">
            {showTrash ? <Trash2 className="h-4 w-4" /> : <History className="h-4 w-4" />}
            {showTrash ? "Lixeira" : "Histórico"}
          </h2>
          <div className="flex gap-2">
            {showTrash && trashed.length > 0 && (
              <Button size="sm" variant="outline" className="text-destructive" onClick={emptyTrash}>
                Esvaziar
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setShowTrash((v) => !v)} className="gap-2">
              {showTrash ? <History className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              {showTrash ? "Ver histórico" : `Lixeira (${trashed.length})`}
            </Button>
          </div>
        </div>

        {(showTrash ? trashed : active).length === 0 ? (
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">
            {showTrash ? "A lixeira está vazia." : "Nenhum registro salvo. Use o botão \"Salvar Registro\" na Calculadora."}
          </CardContent></Card>
        ) : (
          <Card><CardContent className="p-0 divide-y">
            {(showTrash ? trashed : active).map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{h.filter}</p>
                  <p className="text-xs text-muted-foreground">
                    {fmtDate(h.createdAt)} · {h.reserves.length} reservas
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <TrendingUp className="h-4 w-4 text-primary hidden sm:block" />
                  <span className="font-semibold">{brl(h.capital)}</span>
                  {showTrash ? (
                    <>
                      <Button size="icon" variant="ghost" className="h-8 w-8" title="Restaurar" onClick={() => restore(h.id)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" title="Excluir definitivamente" onClick={() => destroy(h.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Mover para Lixeira" onClick={() => moveToTrash(h.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent></Card>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtros de reservas
          <span className="text-xs text-muted-foreground font-normal">(exemplo)</span>
        </h2>
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
    </main>
  );
}
