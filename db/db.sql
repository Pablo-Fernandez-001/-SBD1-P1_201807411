-- Eliminar tablas existentes
DROP TABLE products_devolution CASCADE CONSTRAINTS;     -- X
DROP TABLE delivered_orders CASCADE CONSTRAINTS;        -- X
DROP TABLE images CASCADE CONSTRAINTS;                  -- NO
DROP TABLE products_movements CASCADE CONSTRAINTS;      -- X
DROP TABLE movements CASCADE CONSTRAINTS;               -- X
DROP TABLE inventory CASCADE CONSTRAINTS;               -- NO
DROP TABLE payments_orders CASCADE CONSTRAINTS;         -- X
DROP TABLE products_orders CASCADE CONSTRAINTS;         -- X
DROP TABLE orders CASCADE CONSTRAINTS;                  -- X
DROP TABLE directions CASCADE CONSTRAINTS;              -- X
DROP TABLE payments CASCADE CONSTRAINTS;                -- NO
DROP TABLE clients CASCADE CONSTRAINTS;                 -- X
DROP TABLE offices CASCADE CONSTRAINTS;                 -- X
DROP TABLE departments CASCADE CONSTRAINTS;             -- X
DROP TABLE workers CASCADE CONSTRAINTS;                 -- X
DROP TABLE products CASCADE CONSTRAINTS;                -- X
DROP TABLE categories CASCADE CONSTRAINTS;              -- X

-- Crear tablas
CREATE TABLE categories (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offices (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
    id NUMBER PRIMARY KEY,
    national_document VARCHAR2(50) UNIQUE NOT NULL,
    name VARCHAR2(255) NOT NULL,
    lastname VARCHAR2(255) NOT NULL,
    phone VARCHAR2(255),
    email VARCHAR2(255) UNIQUE,
    active NUMBER(1) DEFAULT 1,
    confirmed_email NUMBER(1) DEFAULT 1,
    password VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workers (
    id NUMBER PRIMARY KEY,
    national_document VARCHAR2(50) UNIQUE NOT NULL,
    name VARCHAR2(255) NOT NULL,
    lastname VARCHAR2(255) NOT NULL,
    job VARCHAR2(100),
    department_id NUMBER REFERENCES departments(id) ON DELETE SET NULL,
    phone VARCHAR2(255),
    email VARCHAR2(255) UNIQUE,
    location_id NUMBER REFERENCES offices(id) ON DELETE SET NULL,
    active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id NUMBER PRIMARY KEY,
    sku VARCHAR2(100) NOT NULL,
    name VARCHAR2(255) NOT NULL,
    description VARCHAR2(510),
    price NUMBER NOT NULL,
    slug VARCHAR2(255) NOT NULL,
    category_id NUMBER REFERENCES categories(id) ON DELETE SET NULL,
    active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id NUMBER PRIMARY KEY,
    client_id NUMBER REFERENCES clients(id) ON DELETE CASCADE,
    payment_method VARCHAR2(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE directions (
    id NUMBER PRIMARY KEY,
    client_id NUMBER REFERENCES clients(id) ON DELETE CASCADE,
    address VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id NUMBER PRIMARY KEY,
    client_id NUMBER REFERENCES clients(id) ON DELETE CASCADE,
    location_id NUMBER REFERENCES offices(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products_orders (
    id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES orders(id) ON DELETE CASCADE,
    product_id NUMBER REFERENCES products(id) ON DELETE CASCADE,
    quantity NUMBER NOT NULL,
    price NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments_orders (
    id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR2(100),
    status VARCHAR2(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id NUMBER PRIMARY KEY,
    product_id NUMBER REFERENCES products(id) ON DELETE CASCADE,
    location_id NUMBER REFERENCES offices(id) ON DELETE SET NULL,
    quantity NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movements (
    id NUMBER PRIMARY KEY,
    location_origin_id NUMBER REFERENCES offices(id) ON DELETE SET NULL,
    location_dest_id NUMBER REFERENCES offices(id) ON DELETE SET NULL,
    status VARCHAR2(250),
    estimate_arrive_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products_movements (
    id NUMBER PRIMARY KEY,
    movement_id NUMBER REFERENCES movements(id) ON DELETE CASCADE,
    product_id NUMBER REFERENCES products(id) ON DELETE CASCADE,
    quantity NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images (
    id NUMBER PRIMARY KEY,
    product_id NUMBER REFERENCES products(id) ON DELETE CASCADE,
    image VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivered_orders (
    id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES orders(id) ON DELETE CASCADE,
    company VARCHAR2(255),
    address VARCHAR2(255),
    number_company_guide VARCHAR2(100),
    status VARCHAR2(50),
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products_devolution (
    id NUMBER PRIMARY KEY,
    product_id NUMBER REFERENCES products(id) ON DELETE CASCADE,
    description VARCHAR2(510),
    status VARCHAR2(50),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultas para verificar datos
SELECT * FROM categories;
SELECT * FROM clients;
SELECT * FROM payments;
SELECT * FROM directions;
SELECT * FROM workers;
SELECT * FROM departments;
SELECT * FROM offices;
SELECT * FROM orders;
SELECT * FROM products_orders;
SELECT * FROM payments_orders;
SELECT * FROM inventory;
SELECT * FROM products_movements;
SELECT * FROM products;
SELECT * FROM images;
SELECT * FROM movements;
SELECT * FROM delivered_orders;
SELECT * FROM products_devolution;