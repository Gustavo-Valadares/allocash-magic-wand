import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { LayoutGrid, PieChart as PieIcon, BarChart3 } from "lucide-react";
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
      <div role="tablist" className="relative grid grid-cols-3 rounded-lg bg-muted p-1">
        <span
          className="absolute top-1 bottom-1 left-1 rounded-md bg-background shadow-sm transition-transform duration-300"
          style={{ width: "calc((100% - 0.5rem) / 3)", transform: `translateX(${index * 100}%)` }}
        />
        {TABS.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={index === i}
            onClick={() => embla?.scrollTo(i)}
            className={`relative z-10 flex items-center justify-center gap-1.5 py-1.5 text-sm transition-colors ${
              index === i ? "text-foreground font-medium" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
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
