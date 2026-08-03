// artifacts/knoxit/src/components/Header.tsx
import { useState } from "react";
import { Menu, Bell, Coins } from "lucide-react";
import { Drawer } from "./Drawer";

export function Header({ betaLabel = "BETA" }: { betaLabel?: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={() => setDrawerOpen(true)}>
          <Menu size={20} className="text-zinc-300" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-extrabold text-[17px] tracking-wide">KNOXIT</span>
          <span className="text-[9px] font-bold text-amber-400 border border-amber-400/40 rounded-full px-1.5 py-0.5 leading-none">
            {betaLabel}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Bell size={18} className="text-zinc-300" />
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-1">
            <Coins size={12} className="text-amber-400" />
            {/* TODO: replace with real chip balance from useUserChipBalance() hook */}
            <span className="text-amber-400 text-[11px] font-bold">6,200</span>
          </div>
        </div>
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <button onClick={onBack} className="text-zinc-300 text-[18px]">←</button>
      <span className="text-white font-bold text-[15px]">{title}</span>
      <div className="w-[18px]" />
    </div>
  );
}
