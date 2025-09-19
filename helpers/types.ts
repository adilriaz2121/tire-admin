// FORMS

export type LoginFormType = {
  email: string;
  password: string;
};

export interface IUser {
  id: string;
  email: string;
  name?: string;
  password?: string;
  roles: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface IArticle {
  id: string;
  title: string;
  detail: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discount: number;
  validFrom?: string;
  validTo?: string;
  maxUse?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  id: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  size: string;
  mfg: string;
  item: string;
  detail: string;
  description: string;
  quantity: number;
  price: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: IReview[];
}

export interface IReview {
  id: string;
  name: string;
  country: string;
  review: string;
  rating: number;
  productsId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IColumn {
  name: string;
  uid: string;
}

export interface Result<T> {
  data?: T;
  error?: string;
  meta?: IMeta;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
