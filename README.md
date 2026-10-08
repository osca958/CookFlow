# CookFlow - Backend

API REST de una aplicación de recetas, restaurantes y lista de la compra automática.

## Tecnologías
- Node.js + Express
- SQL Server (procedimientos almacenados)
- JWT para autenticación y bcrypt para contraseñas

## Instalación
1. `npm install`
2. Crear la base de datos `CookFlow` y ejecutar los scripts de `database/`
3. Copiar `.env.example` a `.env` y rellenar las credenciales y `JWT_SECRET`
4. `node app.js` (servidor en http://localhost:3000)

## Endpoints principales
| Recurso | Públicos | Requieren login |
|---|---|---|
| `/recetas` | GET (listado, detalle, por categoría, ingredientes) | POST, PUT, DELETE (solo el autor) |
| `/categorias`, `/ingredientes` | GET | POST, PUT, DELETE |
| `/restaurantes` | GET, `/ranking` | POST, PUT, DELETE |
| `/usuarios` | `/registro`, `/login` | resto |
| `/visitas` | - | todos |
| `/favoritos` | - | todos |

Las rutas protegidas necesitan la cabecera `Authorization: Bearer <token>`.

## Estado del proyecto
- [x] Base de datos y procedimientos almacenados
- [x] CRUD de recetas, ingredientes, categorías, restaurantes, usuarios y visitas
- [x] Registro, login y rutas protegidas (JWT)
- [x] Favoritos
- [ ] Lista de la compra
- [ ] Frontend
