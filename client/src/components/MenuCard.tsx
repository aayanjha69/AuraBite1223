import { MenuItem } from "@shared/schema";
import { Link } from "wouter";
import { ShoppingBag, Star, Clock } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";

export function MenuCard({ item }: { item: MenuItem }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.popular && (
          <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Best Seller
          </div>
        )}
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-primary">
            ${(item.price / 100).toFixed(2)}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-4 mt-auto">
          <Link href={`/menu/${item.id}`} className="flex-1">
            <button className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors">
              Customize
            </button>
          </Link>
          <button 
            onClick={() => addToCart(item, 1)}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
