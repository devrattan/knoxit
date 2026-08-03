// artifacts/knoxit/src/components/BottomNav.tsx
import { useLocation } from "wouter";
import { Home as HomeIcon, Trophy, Target, Calendar, ShoppingBag } from "lucide-react";

const items = [
  { path: "/", icon: HomeIcon, label: "Home" },
  { path: "/my-leagues", icon: Trophy, label: "My Leagues" },
  { path: "/picks", icon: Target, label: "Picks" },
  { path: "/fixtures", icon: Calendar, label: "Fixtures" },
  { path: "/shop", icon: ShoppingBag, label: "Shop" },
];

export function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <div className="flex border-t border-white/5 bg-black/40 pt-2 pb-3">
      {items.map((item) => {
        const active = location === item.path;
        return (
          <button
            key={item.path}
            onClick={() => setLocation(item.path)}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <item.icon size={19} className={active ? "text-[var(--theme-primary)]" : "text-zinc-500"} />
            <span className={`text-[9px] ${active ? "text-[var(--theme-primary)] font-semibold" : "text-zinc-500"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
