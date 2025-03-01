CREATE TABLE categories (
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
    active BOOLEAN DEFAULT TRUE,
    confirmed_email BOOLEAN DEFAULT FALSE,
    password VARCHAR2(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    active BOOLEAN DEFAULT TRUE,
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

CREATE TABLE products_movements (
    id NUMBER PRIMARY KEY,
    movement_id NUMBER REFERENCES movements(id),
    product_id NUMBER REFERENCES products(id),
    quantity NUMBER NOT NULL,
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
    active BOOLEAN DEFAULT TRUE,
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

DROP TABLE categories;
DROP TABLE clients;
DROP TABLE payments;
DROP TABLE directions;
DROP TABLE workers;
DROP TABLE departments;
DROP TABLE offices;
DROP TABLE orders;
DROP TABLE products_orders;
DROP TABLE payments_orders;
DROP TABLE inventory;
DROP TABLE products_movements;
DROP TABLE products;
DROP TABLE images;
DROP TABLE movements;
DROP TABLE delivered_orders;
DROP TABLE products_devolution;