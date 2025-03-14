# Manual de Usuario y Manual Técnico

## Manual de Usuario

### Introducción
Este manual guía a los usuarios en el uso de la API desarrollada para la gestión de una empresa de ventas y distribución. A continuación, se detallan los pasos para interactuar con los diferentes endpoints.

### Requisitos Previos
- Tener acceso a la API.
- Contar con una herramienta como Postman o cURL para realizar solicitudes HTTP.
- Disponer de credenciales de autenticación.
- Node.js instalado en la máquina.
- Para correr el proyecto, ejecutar:
  ```sh
  npm run dev
  ```

### Gestión de Usuarios

#### Crear Usuario (Registro)
**Método:** POST  
**Endpoint:** `/api/users`

**Ejemplo de Request:**
```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "secret123",
  "phone": "12345678"
}
```

**Ejemplo de Respuesta:**
```json
{
  "status": "success",
  "message": "User created successfully"
}
```

...
(Otros endpoints con su respectiva documentación)

## Manual Técnico

### Tecnologías Utilizadas
- **Backend:** Node.js
- **Framework:** Express.js
- **Middlewares:** Morgan, CORS (versiones actualizadas)
- **Base de Datos:** Oracle SQL

### Esquema Conceptual
Se diseñó un modelo entidad-relación para la gestión de usuarios, productos, órdenes, pagos y envíos, asegurando la integridad de datos y relaciones entre entidades clave.

**Modelo ER:** ![Modelo Entidad-Relación](https://github.com/Pablo-Fernandez-001/-SBD1-P1_201807411/blob/main/ER.png)

### Esquema Lógico
Cada entidad del modelo conceptual se transformó en una tabla con sus respectivas relaciones y claves foráneas.

### Esquema Físico
Se implementó en Oracle, definiendo los tipos de datos óptimos y restricciones de integridad.

### Normalización
Las tablas fueron normalizadas hasta la tercera forma normal (3NF) para reducir redundancia y mejorar la eficiencia. La normalización se aplicó a todas las tablas, aunque las más afectadas fueron las relacionadas con los pagos, ya que ahora se dividen en tres tablas, incorporando métodos de pago adicionales.

### Descripción de la API
La API está desarrollada en Node.js con Express y se conecta a la base de datos Oracle. Sigue una arquitectura RESTful.

### Endpoints Utilizados
- `/api/users` - Gestión de usuarios
- `/api/products` - Gestión de productos
- `/api/categories` - Gestión de categorías
- `/api/payments` - Gestión de pagos
- `/api/directions` - Gestión de direcciones
- `/api/workers` - Gestión de trabajadores
- `/api/departments` - Gestión de departamentos
- `/api/offices` - Gestión de oficinas
- `/api/orders` - Gestión de órdenes
- `/api/productsOrders` - Gestión de productos en órdenes
- `/api/paymentsOrders` - Gestión de pagos en órdenes
- `/api/inventory` - Gestión de inventario
- `/api/productsMovements` - Gestión de movimientos de productos
- `/api/images` - Gestión de imágenes
- `/api/movements` - Gestión de movimientos
- `/api/deliveredOrders` - Gestión de órdenes entregadas
- `/api/productsDevolution` - Gestión de devoluciones de productos

### Métodos por Endpoint
Cada endpoint implementa los siguientes métodos:
- **GET `/`**: Obtener todos los registros.
- **GET `/:id`**: Obtener un registro por ID.
- **POST `/dynamic`**: Consultas dinámicas.
- **POST `/`**: Crear un nuevo registro.
- **PUT `/:id`**: Actualizar un registro.
- **DELETE `/:id`**: Eliminar un registro.
- **DELETE `/`**: Eliminar todos los registros.
- **POST `/bulkLoad`**: Carga masiva de datos.

**Autenticación:** Solo el endpoint de usuarios (`/api/users`) maneja autenticación, con los métodos `POST /login` y `POST /auth` para gestionar sesiones y autorización.

...
(Detalles adicionales según los requerimientos)
