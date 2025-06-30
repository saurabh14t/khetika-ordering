-- Orders table schema for Dolibarr Dashboard
-- This schema matches the component's expectations with JSON items storage

-- Drop existing orders table if it exists
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table with JSON items storage
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    order_date DATE NOT NULL,
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Sample orders with JSON items
INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, items, total_amount, status, payment_status, order_date, notes) VALUES
('ORD-20240115-001', 'John Doe', 'john.doe@email.com', '+91 98765 43210', 
 '[{"product_name": "Laptop Pro X1", "quantity": 1, "unit_price": 1299.99, "total_price": 1299.99}, {"product_name": "Wireless Mouse", "quantity": 2, "unit_price": 29.99, "total_price": 59.98}]', 
 1359.97, 'delivered', 'paid', '2024-01-15', 'Priority delivery requested'),
('ORD-20240114-001', 'Jane Smith', 'jane.smith@email.com', '+91 98765 43211', 
 '[{"product_name": "Mechanical Keyboard", "quantity": 1, "unit_price": 89.99, "total_price": 89.99}, {"product_name": "Bluetooth Headphones", "quantity": 1, "unit_price": 79.99, "total_price": 79.99}]', 
 169.98, 'shipped', 'paid', '2024-01-14', 'Gift wrapping required'),
('ORD-20240113-001', 'Bob Johnson', 'bob.johnson@email.com', '+91 98765 43212', 
 '[{"product_name": "Webcam HD", "quantity": 1, "unit_price": 149.99, "total_price": 149.99}]', 
 149.99, 'processing', 'pending', '2024-01-13', 'Standard delivery'),
('ORD-20240112-001', 'Rajesh Kumar', 'rajesh.kumar@email.com', '+91 98765 43214', 
 '[{"product_name": "Tablet 10\"", "quantity": 1, "unit_price": 299.99, "total_price": 299.99}]', 
 299.99, 'pending', 'pending', '2024-01-12', 'Corporate order'),
('ORD-20240111-001', 'Priya Sharma', 'priya.sharma@email.com', '+91 98765 43215', 
 '[{"product_name": "Monitor 24\"", "quantity": 1, "unit_price": 199.99, "total_price": 199.99}, {"product_name": "USB Cable", "quantity": 1, "unit_price": 9.99, "total_price": 9.99}]', 
 209.98, 'delivered', 'paid', '2024-01-11', 'Home office setup'),
('ORD-20240110-001', 'John Doe', 'john.doe@email.com', '+91 98765 43210', 
 '[{"product_name": "Laptop Pro X1", "quantity": 1, "unit_price": 1299.99, "total_price": 1299.99}]', 
 1299.99, 'delivered', 'paid', '2024-01-10', 'Replacement order'); 