import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { LayoutGrid, PieChart as PieIcon, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Item {
  id: string;
  name: string;
  percentage: number;
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
];

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const TABS = [
  { label: "Cards", icon: LayoutGrid },
  { label: "Pizza", icon: PieIcon },
  { label: "Barras", icon: BarChart3 },
];

export default function ReserveViews({
  reserves,
  capital,
  cards,
}: {
  reserves: Item[];
  capital: number;
  cards: ReactNode;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", watchDrag: true });
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => embla && setIndex(embla.selectedScrollSnap()), [embla]);
  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  // Re-measure when content height changes (e.g. reserves added)
  useEffect(() => {
    embla?.reInit();
  }, [embla, reserves.length]);

  const data = reserves.map((r) => ({
    name: r.name,
    percentage: r.percentage,
    value: (capital * r.percentage) / 100,
  }));

  const tooltip = (
    <Tooltip
      contentStyle={{
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        color: "var(--popover-foreground)",
      }}
      formatter={(_v, _n, p) => {
        const d = p.payload as (typeof data)[number];
        return [`${d.percentage}% · ${brl(d.value)}`, d.name];
      }}
    />
  );

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="Visualização da distribuição" className="relative grid grid-cols-3 border-b-2 border-border">
        <span
          className="absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-primary transition-transform duration-300 motion-reduce:transition-none"
          style={{ width: "calc(100% / 3)", transform: `translateX(${index * 100}%)` }}
        />
        {TABS.map(({ label, icon: Icon }, i) => (
          <Button
            key={label}
            variant="ghost"
            role="tab"
            aria-label={label}
            title={label}
            aria-selected={index === i}
            onClick={() => embla?.scrollTo(i)}
            className={`relative z-10 h-11 rounded-none transition-colors ${
              index === i ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
          </Button>
        ))}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-start">
          <div className="min-w-0 shrink-0 grow-0 basis-full">{cards}</div>

          <div className="min-w-0 shrink-0 grow-0 basis-full">
            <div className="h-72 rounded-xl border bg-card p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="percentage"
                    nameKey="name"
                    innerRadius="45%"
                    outerRadius="80%"
                    paddingAngle={2}
                    stroke="var(--background)"
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  {tooltip}
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {data.map((d, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.name} <span className="text-muted-foreground">{brl(d.value)}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0 shrink-0 grow-0 basis-full">
            <div className="h-72 rounded-xl border bg-card p-2 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} interval={0} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} unit="%" />
                  {tooltip}
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
