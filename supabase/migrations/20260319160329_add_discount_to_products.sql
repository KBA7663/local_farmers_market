-- Add discount_percent column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0;
COMMENT ON COLUMN public.products.discount_percent IS 'Discount percentage allowed on the product';
