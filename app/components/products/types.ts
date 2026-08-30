export interface StorageOption {
  storage: string;
  originalPrice: number;
  salePrice?: number;
}

export interface ProductVariant {
  color: string;
  colorCode: string;
  images: string[];
  storageOptions: StorageOption[];
}

export interface Product {
  _id: string;
  name: string;
  brief?: string;
  originalPrice: number;
  salePrice?: number;
  price: number;
  discountPercent: number;
  description?: string;
  image?: string;
  images?: string[];
  variants?: ProductVariant[];
  color?: string;
  storage?: string;
  network?: string;
  screenSize?: string;
  specs?: {
    screen?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    rearCamera?: string;
    frontCamera?: string;
    battery?: string;
    batteryLife?: string;
    charging?: string;
    os?: string;
    extras?: string;
  };
  freeDelivery: boolean;
  deliveryTime: string;
  warrantyYears: number;
  installment?: {
    available: boolean;
    downPayment?: number;
    months?: number;
    note?: string;
    conditions?: string[];
    policy?: string;
  };
  taxIncluded: boolean;
  category?: string;
  subCategory?: string;
  brand?: string;
  inStock: boolean;
}
