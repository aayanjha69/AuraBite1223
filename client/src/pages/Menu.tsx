import { useState } from "react";
import { useMenu } from "@/hooks/use-menu";
import { MenuCard } from "@/components/MenuCard";
import { Search, Loader2 } from "lucide-react";

export default function Menu() {
  const { data: menuItems, isLoading } = useMenu();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "Breakfast", "Meals", "Snacks", "Drinks"];

  const filteredItems = menuItems?.filter(item => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-display">Our Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of delicious meals, crafted to satisfy your cravings.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-card p-4 rounded-2xl border border-white/5">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-auto min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-transparent rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => <MenuCard key={item.id} item={item} />)
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No items found. Try a different search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
