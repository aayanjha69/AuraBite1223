import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}${api.menu.list.path}`);

      if (!res.ok) throw new Error("Failed to fetch menu");

      return api.menu.list.responses[200].parse(await res.json());
    },
  });
}

export function useMenuItem(id: number) {
  return useQuery({
    queryKey: ["menuItem", id],
    queryFn: async () => {
      const url = buildUrl(api.menu.get.path, { id });

      const res = await fetch(`${BASE_URL}${url}`);

      if (res.status === 404) throw new Error("Menu item not found");
      if (!res.ok) throw new Error("Failed to fetch menu item");

      return api.menu.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}
