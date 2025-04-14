export interface Supplement {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  rating: number;
  tags: string[];
  recommended: boolean;
  recommendationReason?: string;
  benefits: string[];
  ingredients: string;
  suggestedUse: string;
  quantity?: number;
}

export interface CartItem extends Supplement {
  quantity: number;
}