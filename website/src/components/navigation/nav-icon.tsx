import {
  Boxes,
  Brain,
  CalendarDays,
  ChartNoAxesCombined,
  Compass,
  Gauge,
  Layers,
  Play,
  Scale,
  Target,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  boxes: Boxes,
  calendar: CalendarDays,
  brain: Brain,
  play: Play,
  target: Target,
  layers: Layers,
  scale: Scale,
  gauge: Gauge,
  chart: ChartNoAxesCombined,
  compass: Compass,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Compass;
  return <Icon className={className} />;
}
