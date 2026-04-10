export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
  isDiscounted?: boolean;
  discountPercentage?: number;
}
