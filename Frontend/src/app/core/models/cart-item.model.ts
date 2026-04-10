import { Product } from './product.model';
import { User } from './user.model';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  user?: User;
  product?: Product;
}
