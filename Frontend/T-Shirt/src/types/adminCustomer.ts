export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  active: boolean;
  createdAt: string;
}
