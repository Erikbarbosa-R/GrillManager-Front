export type RestaurantInfo = {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  theme?: Record<string, unknown>;
};

type Database = {
  restaurant: RestaurantInfo | null;
};

const db: Database = {
  restaurant: null,
};

export function getOrInitRestaurant(): RestaurantInfo {
  if (!db.restaurant) {
    db.restaurant = {
      name: 'GrillManager',
      description: 'Seu restaurante de grelhados',
    };
  }
  return db.restaurant;
}

export function setRestaurant(update: Partial<RestaurantInfo>): RestaurantInfo {
  const current = getOrInitRestaurant();
  db.restaurant = { ...current, ...update };
  return db.restaurant;
}


