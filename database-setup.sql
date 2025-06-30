-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop existing functions and triggers if they exist
DROP FUNCTION IF EXISTS update_inventory_status() CASCADE;
DROP FUNCTION IF EXISTS update_customer_stats() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    last_order DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'in-stock' CHECK (status IN ('in-stock', 'low-stock', 'out-of-stock')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create order_items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES inventory(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Create function to update inventory status based on quantity
CREATE OR REPLACE FUNCTION update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity <= 0 THEN
        NEW.status = 'out-of-stock';
    ELSIF NEW.quantity <= NEW.min_quantity THEN
        NEW.status = 'low-stock';
    ELSE
        NEW.status = 'in-stock';
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update inventory status
CREATE TRIGGER trigger_update_inventory_status
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_status();

-- Create function to update customer stats when order is created/updated
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE customers 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount,
            last_order = NEW.order_date,
            updated_at = NOW()
        WHERE email = NEW.customer_email;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes that might affect customer stats
        IF OLD.status != NEW.status AND NEW.status = 'delivered' THEN
            UPDATE customers 
            SET total_spent = total_spent + NEW.total_amount,
                updated_at = NOW()
            WHERE email = NEW.customer_email;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update customer stats
CREATE TRIGGER trigger_update_customer_stats
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_stats();

-- Insert sample data

-- Sample customers
INSERT INTO customers (name, email, phone, company, total_orders, total_spent, last_order, status) VALUES
('John Doe', 'john.doe@email.com', '+91 98765 43210', 'Tech Corp', 15, 2345.67, '2024-01-15', 'active'),
('Jane Smith', 'jane.smith@email.com', '+91 98765 43211', 'Design Studio', 8, 1234.56, '2024-01-10', 'vip'),
('Bob Johnson', 'bob.johnson@email.com', '+91 98765 43212', 'Marketing Inc', 3, 567.89, '2024-01-05', 'active'),
('Alice Brown', 'alice.brown@email.com', '+91 98765 43213', 'Consulting LLC', 0, 0.00, NULL, 'inactive'),
('Rajesh Kumar', 'rajesh.kumar@email.com', '+91 98765 43214', 'Software Solutions', 12, 3456.78, '2024-01-12', 'active'),
('Priya Sharma', 'priya.sharma@email.com', '+91 98765 43215', 'Digital Agency', 6, 890.12, '2024-01-08', 'active');

-- Sample inventory
INSERT INTO inventory (name, sku, category, quantity, min_quantity, price, status) VALUES
('Laptop Pro X1', 'LP-X1-001', 'Electronics', 15, 10, 1299.99, 'in-stock'),
('Wireless Mouse', 'WM-001', 'Accessories', 5, 10, 29.99, 'low-stock'),
('USB Cable', 'USB-C-001', 'Accessories', 0, 5, 9.99, 'out-of-stock'),
('Monitor 24"', 'MON-24-001', 'Electronics', 8, 5, 199.99, 'in-stock'),
('Mechanical Keyboard', 'KB-MECH-001', 'Accessories', 12, 8, 89.99, 'in-stock'),
('Webcam HD', 'WC-HD-001', 'Electronics', 3, 5, 149.99, 'low-stock'),
('Bluetooth Headphones', 'BH-BT-001', 'Accessories', 20, 10, 79.99, 'in-stock'),
('Tablet 10"', 'TAB-10-001', 'Electronics', 6, 3, 299.99, 'in-stock');

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

-- Sample order items
INSERT INTO order_items (order_id, inventory_id, product_name, quantity, price) VALUES
((SELECT id FROM orders WHERE customer_name = 'John Doe' AND order_date = '2024-01-15'), 
 (SELECT id FROM inventory WHERE sku = 'LP-X1-001'), 'Laptop Pro X1', 1, 1299.99),
((SELECT id FROM orders WHERE customer_name = 'John Doe' AND order_date = '2024-01-15'), 
 (SELECT id FROM inventory WHERE sku = 'WM-001'), 'Wireless Mouse', 2, 29.99),
((SELECT id FROM orders WHERE customer_name = 'Jane Smith' AND order_date = '2024-01-14'), 
 (SELECT id FROM inventory WHERE sku = 'KB-MECH-001'), 'Mechanical Keyboard', 1, 89.99),
((SELECT id FROM orders WHERE customer_name = 'Jane Smith' AND order_date = '2024-01-14'), 
 (SELECT id FROM inventory WHERE sku = 'BH-BT-001'), 'Bluetooth Headphones', 1, 79.99),
((SELECT id FROM orders WHERE customer_name = 'Bob Johnson' AND order_date = '2024-01-13'), 
 (SELECT id FROM inventory WHERE sku = 'WC-HD-001'), 'Webcam HD', 1, 149.99),
((SELECT id FROM orders WHERE customer_name = 'Rajesh Kumar' AND order_date = '2024-01-12'), 
 (SELECT id FROM inventory WHERE sku = 'TAB-10-001'), 'Tablet 10"', 1, 299.99),
((SELECT id FROM orders WHERE customer_name = 'Priya Sharma' AND order_date = '2024-01-11'), 
 (SELECT id FROM inventory WHERE sku = 'MON-24-001'), 'Monitor 24"', 1, 199.99),
((SELECT id FROM orders WHERE customer_name = 'Priya Sharma' AND order_date = '2024-01-11'), 
 (SELECT id FROM inventory WHERE sku = 'USB-C-001'), 'USB Cable', 1, 9.99); 