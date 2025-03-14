-- Consultas SQL para la gestión de datos en Oracle

-- Obtener todos los usuarios activos
SELECT usuario_id, username, email, telefono, fecha_registro 
FROM Usuarios 
WHERE activo = 1;

-- Obtener detalles de un usuario específico por ID
SELECT * FROM Usuarios WHERE usuario_id = :id;

-- Listar todos los productos disponibles
SELECT * FROM Productos WHERE activo = 1;

-- Obtener productos por categoría
SELECT * FROM Productos WHERE categoria = :categoria;

-- Consultar órdenes de un usuario
SELECT * FROM Ordenes WHERE usuario_id = :usuario_id;

-- Obtener detalles de una orden específica
SELECT o.orden_id, o.fecha_creacion, d.producto_id, d.cantidad, d.precio_unitario
FROM Ordenes o
JOIN Detalles_Orden d ON o.orden_id = d.orden_id
WHERE o.orden_id = :orden_id;

-- Consultar pagos de una orden
SELECT * FROM Pagos WHERE orden_id = :orden_id;

-- Obtener el total de ventas por mes
SELECT TO_CHAR(fecha_creacion, 'YYYY-MM') AS mes, SUM(total) AS total_ventas
FROM Ordenes
GROUP BY TO_CHAR(fecha_creacion, 'YYYY-MM')
ORDER BY mes DESC;

-- Obtener productos con stock bajo
SELECT nombre, stock FROM Productos WHERE stock < 10;

-- Contar la cantidad de órdenes en cada estado
SELECT estado, COUNT(*) AS cantidad FROM Ordenes GROUP BY estado;
