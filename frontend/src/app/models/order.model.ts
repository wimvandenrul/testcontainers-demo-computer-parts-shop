import { CartItem, CustomerInfo } from './cart.model';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: CustomerInfo;
  date: string;
}