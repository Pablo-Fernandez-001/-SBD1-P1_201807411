-- CREACIÓN DE TABLAS PARA EL PROYECTO DE VENTAS Y DISTRIBUCIÓN

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    identificacion VARCHAR2(20) UNIQUE NOT NULL,
    nombre VARCHAR2(50) NOT NULL,
    apellido VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    telefono VARCHAR2(20),
    activo NUMBER(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmado NUMBER(1) DEFAULT 0
);

-- Tabla de Direcciones de Usuario
CREATE TABLE direcciones (
    id_direccion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER REFERENCES usuarios(id_usuario),
    direccion VARCHAR2(255) NOT NULL,
    ciudad VARCHAR2(100),
    estado VARCHAR2(100),
    codigo_postal VARCHAR2(20),
    pais VARCHAR2(100)
);

-- Tabla de Métodos de Pago
CREATE TABLE metodos_pago (
    id_metodo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER REFERENCES usuarios(id_usuario),
    tipo_pago VARCHAR2(50) NOT NULL,
    detalles_pago VARCHAR2(255) NOT NULL
);

-- Tabla de Trabajadores
CREATE TABLE trabajadores (
    id_trabajador NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    identificacion VARCHAR2(20) UNIQUE NOT NULL,
    nombre VARCHAR2(50) NOT NULL,
    apellido VARCHAR2(50) NOT NULL,
    cargo VARCHAR2(50) NOT NULL,
    departamento VARCHAR2(50),
    telefono VARCHAR2(20),
    email VARCHAR2(100) UNIQUE NOT NULL,
    sede VARCHAR2(100),
    activo NUMBER(1) DEFAULT 1
);

-- Tabla de Productos
CREATE TABLE productos (
    id_producto NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku VARCHAR2(50) UNIQUE NOT NULL,
    nombre VARCHAR2(100) NOT NULL,
    descripcion CLOB,
    precio NUMBER(10,2) NOT NULL,
    slug VARCHAR2(100) UNIQUE,
    activo NUMBER(1) DEFAULT 1,
    categoria VARCHAR2(100)
);

-- Tabla de Inventario
CREATE TABLE inventario (
    id_inventario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto NUMBER REFERENCES productos(id_producto),
    id_sede NUMBER REFERENCES trabajadores(id_trabajador),
    cantidad NUMBER NOT NULL
);

-- Tabla de Órdenes de Compra
CREATE TABLE ordenes (
    id_orden NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER REFERENCES usuarios(id_usuario),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total NUMBER(10,2) NOT NULL
);

-- Tabla de Detalle de Órdenes
CREATE TABLE detalle_orden (
    id_detalle NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden NUMBER REFERENCES ordenes(id_orden),
    id_producto NUMBER REFERENCES productos(id_producto),
    cantidad NUMBER NOT NULL,
    precio_unitario NUMBER(10,2) NOT NULL
);

-- Tabla de Pagos
CREATE TABLE pagos (
    id_pago NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden NUMBER REFERENCES ordenes(id_orden),
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total NUMBER(10,2) NOT NULL,
    metodo_pago VARCHAR2(50) NOT NULL,
    estado VARCHAR2(20) CHECK (estado IN ('pendiente', 'aprobado', 'rechazado'))
);

-- Tabla de Envíos
CREATE TABLE envios (
    id_envio NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden NUMBER REFERENCES ordenes(id_orden),
    fecha_despacho TIMESTAMP,
    direccion_entrega VARCHAR2(255) NOT NULL,
    empresa_transporte VARCHAR2(100),
    numero_seguimiento VARCHAR2(50),
    estado_envio VARCHAR2(20) CHECK (estado_envio IN ('en tránsito', 'entregado', 'devuelto'))
);

-- Tabla de Devoluciones
CREATE TABLE devoluciones (
    id_devolucion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden NUMBER REFERENCES ordenes(id_orden),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo CLOB,
    estado VARCHAR2(20) CHECK (estado IN ('en revisión', 'aprobada', 'rechazada'))
);

-- Tabla de Traslados de Productos entre Sedes
CREATE TABLE traslados (
    id_traslado NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    almacen_origen VARCHAR2(100) NOT NULL,
    almacen_destino VARCHAR2(100) NOT NULL,
    id_producto NUMBER REFERENCES productos(id_producto),
    cantidad_transferida NUMBER NOT NULL,
    estado VARCHAR2(20) CHECK (estado IN ('pendiente', 'completado')),
    fecha_estimada_llegada TIMESTAMP
);

-- Agregando timestamps a todas las tablas
ALTER TABLE usuarios ADD (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP);
ALTER TABLE trabajadores ADD (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP);
ALTER TABLE productos ADD (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP);
ALTER TABLE ordenes ADD (updated_at TIMESTAMP);
ALTER TABLE pagos ADD (updated_at TIMESTAMP);
ALTER TABLE envios ADD (updated_at TIMESTAMP);
ALTER TABLE devoluciones ADD (updated_at TIMESTAMP);
ALTER TABLE traslados ADD (updated_at TIMESTAMP);
