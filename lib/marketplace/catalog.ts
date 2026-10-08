import rawCatalog from "@/data/products.json";

export type LicenseUnit = "user" | "outlet";

export interface ProductPackage {
  id: string;
  name: string;
  licenseUnit: LicenseUnit;
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  badge: string | null;
  tagline: string;
  description: string;
  screenshots: string[];
  features: string[];
  promoRemaining: number;
  packages: ProductPackage[];
}

export interface CatalogCategory {
  slug: string;
  name: string;
}

export interface Catalog {
  campaign: { id: string; name: string; label: string };
  categories: CatalogCategory[];
  products: Product[];
}

export const catalog = rawCatalog as Catalog;

export const products = catalog.products;
export const catalogCategories = catalog.categories;
export const campaign = catalog.campaign;

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string): CatalogCategory | undefined {
  return catalogCategories.find((category) => category.slug === slug);
}

export function formatIDR(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function discountPercent(pkg: ProductPackage): number {
  if (pkg.originalPrice <= pkg.price) return 0;
  return Math.round((1 - pkg.price / pkg.originalPrice) * 100);
}

export function cheapestPackage(product: Product): ProductPackage | undefined {
  return [...product.packages].sort((a, b) => a.price - b.price)[0];
}
