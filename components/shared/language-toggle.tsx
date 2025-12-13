"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-zinc-900/50 rounded-full p-1 border border-zinc-800">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("en")}
        className={cn(
          "h-7 px-3 text-xs font-bold rounded-full transition-all duration-300",
          language === "en"
            ? "bg-primary text-black hover:bg-primary/90 hover:text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            : "text-zinc-400 hover:text-white hover:bg-transparent"
        )}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage("am")}
        className={cn(
          "h-7 px-3 text-xs font-bold rounded-full transition-all duration-300",
          language === "am"
            ? "bg-primary text-black hover:bg-primary/90 hover:text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            : "text-zinc-400 hover:text-white hover:bg-transparent"
        )}
      >
        AM
      </Button>
    </div>
  );
}
