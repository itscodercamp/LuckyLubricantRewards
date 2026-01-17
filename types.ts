
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  image_url?: string;
  price?: string;
  specs?: string[];
}

export interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  image: string;
  image_url?: string;
  description?: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export type TabType = 'home' | 'products' | 'about' | 'profile' | 'rewards';

export interface User {
  name: string;
  email: string;
  phone: string;
  points: number;
  notifications: AppNotification[];
  city?: string;
  state?: string;
  profile_image?: string;
}
