DROP TABLE categories CASCADE CONSTRAINTS;
DROP TABLE clients CASCADE CONSTRAINTS;
DROP TABLE payments CASCADE CONSTRAINTS;
DROP TABLE directions CASCADE CONSTRAINTS;
DROP TABLE workers CASCADE CONSTRAINTS;
DROP TABLE departments CASCADE CONSTRAINTS;
DROP TABLE offices CASCADE CONSTRAINTS;
DROP TABLE orders CASCADE CONSTRAINTS;
DROP TABLE products_orders CASCADE CONSTRAINTS;
DROP TABLE payments_orders CASCADE CONSTRAINTS;
DROP TABLE inventory CASCADE CONSTRAINTS;
DROP TABLE products_movements CASCADE CONSTRAINTS;
DROP TABLE products CASCADE CONSTRAINTS;
DROP TABLE images CASCADE CONSTRAINTS;
DROP TABLE movements CASCADE CONSTRAINTS;
DROP TABLE delivered_orders CASCADE CONSTRAINTS;
DROP TABLE products_devolution CASCADE CONSTRAINTS;

CREATE TABLE categories (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id NUMBER PRIMARY KEY,
    national_document VARCHAR2(50) UNIQUE NOT NULL,
    name VARCHAR2(255) NOT NULL,
    lastname VARCHAR2(255) NOT NULL,
    phone VARCHAR2(20),
    email VARCHAR2(255) UNIQUE,
    active NUMBER(1) DEFAULT 1,
    confirmed_email NUMBER(1) DEFAULT 1,
    password VARCHAR2(255) NOT NULL,
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
    phone VARCHAR2(20),
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
    department_id NUMBER REFERENCES departments(id),
    phone VARCHAR2(20),
    email VARCHAR2(255) UNIQUE,
    location_id NUMBER REFERENCES offices(id),
    active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id NUMBER PRIMARY KEY,
    sku VARCHAR2(100) UNIQUE NOT NULL,
    name VARCHAR2(255) NOT NULL,
    description CLOB,
    price NUMBER(10,2) NOT NULL,
    slug VARCHAR2(255) UNIQUE NOT NULL,
    category_id NUMBER REFERENCES categories(id),
    active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear las tablas dependientes después
CREATE TABLE payments (
    id NUMBER PRIMARY KEY,
    client_id NUMBER REFERENCES clients(id),
    payment_method VARCHAR2(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE directions (
    id NUMBER PRIMARY KEY,
    client_id NUMBER REFERENCES clients(id),
    address VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id NUMBER PRIMARY KEY,
    client_id NUMBER REFERENCES clients(id),
    location_id NUMBER REFERENCES offices(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products_orders (
    id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES orders(id),
    product_id NUMBER REFERENCES products(id),
    quantity NUMBER NOT NULL,
    price NUMBER(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments_orders (
    id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES orders(id),
    payment_method VARCHAR2(100),
    status VARCHAR2(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id NUMBER PRIMARY KEY,
    product_id NUMBER REFERENCES products(id),
    location_id NUMBER REFERENCES offices(id),
    quantity NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movements (
    id NUMBER PRIMARY KEY,
    location_origin_id NUMBER REFERENCES offices(id),
    location_dest_id NUMBER REFERENCES offices(id),
    status VARCHAR2(50),
    estimate_arrive_date DATE,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products_movements (
    id NUMBER PRIMARY KEY,
    movement_id NUMBER REFERENCES movements(id),
    product_id NUMBER REFERENCES products(id),
    quantity NUMBER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images (
    id NUMBER PRIMARY KEY,
    product_id NUMBER REFERENCES products(id),
    image VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivered_orders (
    id NUMBER PRIMARY KEY,
    order_id NUMBER REFERENCES orders(id),
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
    product_id NUMBER REFERENCES products(id),
    description CLOB,
    status VARCHAR2(50),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM clients;
SELECT COUNT(*) FROM payments;
SELECT COUNT(*) FROM directions;
SELECT COUNT(*) FROM workers;
SELECT COUNT(*) FROM departments;
SELECT COUNT(*) FROM offices;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM products_orders;
SELECT COUNT(*) FROM payments_orders;
SELECT COUNT(*) FROM inventory;
SELECT COUNT(*) FROM products_movements;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM images;
SELECT COUNT(*) FROM movements;
SELECT COUNT(*) FROM delivered_orders;
SELECT COUNT(*) FROM products_devolution;
