# API DE BIBLIOTECA #

**DESCRIPCION**

API REST AUTH para la gestión de usuarios, libros y préstamos en una biblioteca digital. Incluye autenticación con JWT, control de roles (admin y lector), y relaciones entre entidades (Usuario, Libro, Prestamo). Desarrollado con Node.js, Express y MongoDB.

**Tecnologías utilizadas**
Node.js 
Express
MongoDB 
Mongoose
JWT 
Bcrypt 
Insomnia 

 **URL Base http://localhost:3000/api/v1**

**Seed de libros**
1) se ejecuta el Script: npm run seed, la función limpia la colección “libro” e inserta los datos del archivo de seed.
Logs esperados:
Conectado: Conectado a MongoDB
Limpieza: Colección 'libro' limpiada (si existía contenido)
Inserción: X libros insertados
La semilla utiliza el modelo Libro y la colección configurada como ‘libro’.

2) Es necesario el registro y login de 'user' para obtener por GET los libros disponibles

3) Los libros tienen asignado el primer administrador creado como usuario y modificado en MongoDB

4) para agregar prestamo o modificar al administrador, se hace con Update y autorizacion del Admin, mediante token (cargar datos manualmente en Insomnia)EJ:
```sh
{
	"agregarPrestamos":["691e081faf38b2266a18f918"]
}
```
 **ENDPOINTS- LIBRO**


|Metodo | Endpoint  |Middleware | Descripción|
| ------ | ------ |----------|-------------|
|GET |/libro |isAuth |Obtener todos los libros|
|GET |/libro/:id |isAuth |Obtener un libro por ID|
|POST |/libro |isAdmin |Crear nuevo libro|
|PUT |/libro/:id |isAdmin|Actualizar libro (campos simples y arrays con $set, $addToSet, $pull)|
|DELETE |/libro/:id |isAdmin|Eliminar libro|

El lector deberá estar registrado y logueado para obtener los libros disponibles o buscar uno en específico

**POST** Crear libro (http://localhost:3000/api/v1/libro):
```sh
{
  "titulo": "Clean Code",
  "autor": "Robert C. Martin",
  "genero": "Tecnología",
  "administrador": "691cb8e5492d4349b0705a9d" 
  }
```

**ENDPOINTS-PRESTAMO**

|Método |Endpoint |Middleware |Descripción|
| ------ | ------ |----------|------------|
|GET |/prestamo|isAdmin |Obtener préstamos |
|GET |/prestamo/:id |isAdmin|Obtener un préstamo por ID|
|POST |/prestamo |isAdmin|Crear préstamo (lector autenticado)|
|PUT |/prestamo/:id |isAdmin|Actualizar estado del préstamo|
|DELETE |/prestamo/:id |isAdmin |Eliminar préstamo|

Unicamente el Administrador gestionar los prestamos de libros.

**POST** Crear préstamo(http://localhost:3000/api/v1/prestamo):
```sh
{
  "libro": "674a1f2c9f8b123456789abc",
  "lector": "674a2f3d9f8b123456789def",
  "fechaFin": "2025-12-02"
}
```

**UPDATE** Actualizar estado(http://localhost:3000/api/v1/prestamo/:id):

```sh
{
  "estado": "devuelto"
}
```

**ENDPOINTS- USER**

|Método |Endpoint |Middleware |Descripción|
| ------ | ------ |----------|------------|
|POST |/user/register |No necesario|Registra un nuevo usuario. Valida duplicados por email. Rol por defecto: lector|
|POST |/user/login |No necesario |Autentica usuario por email y contraseña. Devuelve token JWT si es correcto|
|GET |/user/ |isAdmin |Obtiene todos los usuarios. Solo accesible para administradores|
|PUT |/user/:id/rol |isAuth/isAdmin |Actualizar usuario: self-update (nombre, email, contraseña), rol solo admin|
|DELETE |/user/:id |isAdmin/isAuth |Elimina un usuario por ID, la propia cuenta del usuario autenticado (requiere email y contraseña)o Admin elimina a otros.|

**REGISTER** (http://localhost:3000/api/v1/user/register):

```sh
{
 "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
}
```

**LOGIN** (http://localhost:3000/api/v1/user/login):

```sh
{
  "email": "juan@example.com",
  "password": "123456",
}
```

*Notas importantes*
Todas las respuestas siguen un formato estructurado para mejor visibilidad en caso de conexión a Front:

{
  "success": true/false,
  "statusCode": 200/201/400/404,
  "data": {...}, // respuesta ok
  "error": {...} // segun el error, tiene detalle de tipo, mensaje , ruta y fecha que permite ver mejor en caso de bug.(Catch seguro: nunca expone stack ni objeto completo, solo tipo y mensaje controlado.)
}

Los middlewares (isAuth, isAdmin) controlan acceso según rol o autenticación.
Arrays actualizados con operadores MongoDB ($set, $addToSet, $pull).