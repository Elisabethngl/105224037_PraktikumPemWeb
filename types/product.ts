export interface Product {
  id: number;
  name: string;
  category: 'Pupuk Tani' | 'Obat Racun & Hama' | 'Benih Unggul' | 'Alat Pertanian';
  price: number;
  unit: string;
  stock: number;
  rating: number;
  sold: number;
  isRegistered: boolean;
  isOrganic?: boolean;
  image: string;
  description: string;
  activeIngredient: string;
  dosageInstruction: string;
  safetyWarning: string;
  registrationNo: string;
  origin: string;
}

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  productId: number;
  quantity: number;
  notes: string;
  paymentMethod: 'Transfer Bank (BCA/BRI)' | 'COD (Bayar di Tempat)' | 'E-Wallet (QRIS)';
  agreedSOP: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  productId?: string;
  quantity?: string;
  agreedSOP?: string;
}

export interface MarketPrice {
  name: string;
  price: string;
  change: string;
  status: 'up' | 'down' | 'flat';
}