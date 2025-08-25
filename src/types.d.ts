
export interface ProductResponse {
  id: number;
  category_id: number;
  brand_id: number;
  name: string;
  description: string;
  short_description: string;
  type: string;
  weight: string;
  dimensions: Dimensions;
  tags: string[];
  warehouse_stocks_count: number;
  warehouse_stocks: WarehouseStock[];
  market: Market;
  category: Category;
  brand: Brand;
  attributes: Attribute[];
}

export interface Dimensions {
  width: number;
  height: number;
  length: number;
}

export interface WarehouseStock {
  id: number;
  supplier_buy_request_id: number;
  supplier_product_id: number;
  warehouse_id: number;
  market_id: number;
  category_id: number;
  product_id: number;
  product_variant_id: number;
  quantity_available: number;
  quantity_sold: number;
  orders_count: number;
  product_variant: ProductVariant;
  price: Price;
  supplier_product: SupplierProduct;
}

export interface ProductVariant {
  name: string;
  sku: string;
  description: string;
  variant_attributes: VariantAttribute[];
  featured_thumb_image_url: string | null;
  preview_images: string[];
}

export interface VariantAttribute {
  id: number;
  product_id: number;
  product_variant_id: number;
  attribute_id: number;
  attribute_option_id: number;
  type: string;
  label: string;
  value: string;
}

export interface Price {
  id: number;
  price: string;
  market_id: number;
  has_discount: boolean;
  discount_price: string | null;
  coupon_price: string | null;
  current_price: string;
  currency_code: string;
  currency_symbol: string;
  cashback_amount: number;
  loyalty_points: number;
}

export interface SupplierProduct {
  id: number;
  market_id: number;
  product_id: number;
  product_variant_id: number;
  brand_id: number;
  likes_count: number;
  is_featured: boolean;
  is_new: boolean;
  is_favorite: boolean;
  reviews_avg_rating: number;
  reviews_count: number;
  reviews: any[]; // If reviews have a structure, replace `any` with that type
}

export interface Market {
  id: number;
  name: string;
  description: string;
  slug: string;
  average_rating: number;
  order_products_count: number;
  followers_count: number;
  reviews_count: number;
  warehouse_stocks_count: number;
  logo_thumb: string;
  country: Country;
  is_new: boolean;
  is_followed: boolean;
}

export interface Country {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  path: string;
  is_active: boolean;
  is_featured: boolean;
  show_in_menu: boolean;
  sort_order: number;
  thumb_image_url: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  parent_id: number;
  has_children: boolean;
  children_count: number;
  products_count: number;
  content_type: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  logo_thumb: string;
}

export interface Attribute {
  id: number;
  name: string;
  description: string;
  display_name: string;
  help_text: string;
  is_required: boolean;
  is_filterable: boolean;
  slug: string;
  type: string;
  options: AttributeOption[];
}

export interface AttributeOption {
  id: number;
  attribute_id: number;
  label: string;
  value: string;
  description: string;
  is_default: boolean;
  is_selected: boolean;
}

export interface Product {
  main_id: number | string;
    id: number | string;
    quantity: number;
    price: number;
    category:string;
    currency: string;
    name: string;
    image: string;
    fit:string|null;
    color: string | null;
    size: string | null;
    discount: number | null;
    isNew: boolean;
    isSpecial: boolean;
    market_name: string, 
    market_logo: string,
}


declare global {
  interface Window {
    _cryptoKey?: CryptoKey; 
  }
}
