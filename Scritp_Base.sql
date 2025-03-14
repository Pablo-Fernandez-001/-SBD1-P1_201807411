-- Creación de la base de datos en Oracle SQL

-- Tabla Usuarios
CREATE TABLE Usuarios (
    usuario_id NUMBER PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    telefono VARCHAR2(15),
    fecha_registro DATE DEFAULT SYSDATE,
    activo NUMBER(1) DEFAULT 1
);

-- Tabla Productos
CREATE TABLE Productos (
    producto_id NUMBER PRIMARY KEY,
    sku VARCHAR2(50) UNIQUE NOT NULL,
    nombre VARCHAR2(100) NOT NULL,
    descripcion CLOB,
    precio NUMBER(10,2) NOT NULL,
    stock NUMBER NOT NULL,
    categoria VARCHAR2(50),
    activo NUMBER(1) DEFAULT 1
);

-- Tabla Órdenes
CREATE TABLE Ordenes (
    orden_id NUMBER PRIMARY KEY,
    usuario_id NUMBER,
    fecha_creacion DATE DEFAULT SYSDATE,
    total NUMBER(10,2),
    estado VARCHAR2(20) CHECK (estado IN ('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado')),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);

-- Tabla Detalles de Órdenes
CREATE TABLE Detalles_Orden (
    detalle_id NUMBER PRIMARY KEY,
    orden_id NUMBER,
    producto_id NUMBER,
    cantidad NUMBER NOT NULL,
    precio_unitario NUMBER(10,2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id)
);

-- Tabla Pagos
CREATE TABLE Pagos (
    pago_id NUMBER PRIMARY KEY,
    orden_id NUMBER,
    monto NUMBER(10,2) NOT NULL,
    metodo_pago VARCHAR2(50),
    estado VARCHAR2(20) CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    fecha_pago DATE DEFAULT SYSDATE,
    FOREIGN KEY (orden_id) REFERENCES Ordenes(orden_id)
);
