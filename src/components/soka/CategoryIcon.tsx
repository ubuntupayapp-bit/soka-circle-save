import { Book, Home, ShoppingCart, Sparkles, Zap } from "lucide-react";
import type { Category } from "@/lib/soka-data";

export function CategoryIcon({ icon, className }: { icon: Category["icon"]; className?: string }) {
  switch (icon) {
    case "cart":
      return <ShoppingCart className={className} />;
    case "book":
      return <Book className={className} />;
    case "bolt":
      return <Zap className={className} />;
    case "home":
      return <Home className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
