export interface ProductOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
  description?: string;
}

export interface ProductCustomization {
  id: string;
  name: string;
  type: 'size' | 'extra' | 'removal' | 'side-dish' | 'protein';
  required: boolean;
  options: ProductOption[];
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  customizations?: ProductCustomization[];
  detailedDescription?: string;
  preparationTime?: string;
  allergens?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  products: Product[];
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  customizations?: Record<string, ProductOption[]>;
  quantity: number;
  detailedDescription?: string;
  preparationTime?: string;
  allergens?: string[];
}

export interface Restaurant {
  name: string;
  description: string;
  bannerImage: string;
  logo: string;
  rating: number;
  whatsapp: string;
  address: string;
}
