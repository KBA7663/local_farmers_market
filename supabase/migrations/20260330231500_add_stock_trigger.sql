-- Migration to automatically update product quantity when an order is inserted or delivered.

-- Create a function to reduce product stock when an order is placed
CREATE OR REPLACE FUNCTION reduce_product_stock()
RETURNS trigger AS $$
BEGIN
  -- We use Math.max equivalent in SQL to avoid negative stock if possible,
  -- but a simple subtraction is fine.
  UPDATE products 
  SET quantity = GREATEST(0, quantity - NEW.quantity)
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the orders table
DROP TRIGGER IF EXISTS reduce_stock_after_order ON orders;
CREATE TRIGGER reduce_stock_after_order
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION reduce_product_stock();
