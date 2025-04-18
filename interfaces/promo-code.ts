export interface PromoCode {
  id?: number
  code: string;
  start_time: Date;
  end_time: Date;
  description: string;
  discount: number;
  products: string[];
  is_public: boolean;
  is_show_countdown: boolean;
}