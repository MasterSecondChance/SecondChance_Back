# :shirt: Troud Backend API

## Descripción

**Troud** es una aplicación backend tipo "Tinder" para intercambio de ropa que permite a los usuarios buscar, encontrar e intercambiar prendas de vestir usadas o nuevas.

## Características Principales

- **Gestión de Usuarios**: Registro, autenticación y gestión de perfiles
- **Catálogo de Artículos**: CRUD completo para prendas de vestir con categorización
- **Sistema de Matching**: Funcionalidad tipo "swipe" con likes, superlikes y dislikes
- **Gestión de Matches**: Creación automática de matches cuando hay interés mutuo
- **Subida de Imágenes**: Integración con AWS S3 para almacenamiento de fotos
- **Autenticación JWT**: Sistema seguro de autenticación con tokens

## Arquitectura Técnica

### Stack Backend
- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: Passport.js (Basic + JWT)
- **Validación**: Joi
- **Almacenamiento**: AWS S3
- **Encriptación**: bcrypt
- **Testing**: Mocha + Supertest + nyc

### Estructura del Proyecto
```
├── config/          # Configuración de variables de entorno
├── lib/             # Conexión a MongoDB
├── routes/          # Rutas de la API
├── schemas/         # Validación de datos con Joi
├── services/        # Lógica de negocio
├── utils/           # Utilidades (auth, mocks, testing)
├── test/            # Pruebas unitarias e integración
└── index.js         # Punto de entrada de la aplicación
```

## Instalación y Configuración

### Prerrequisitos
- Node.js >= 14.x
- MongoDB >= 4.x
- Cuenta de AWS (para S3)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/personal/troud.git
cd troud

# Instalar dependencias
npm install

# Auditoría de seguridad (recomendado)
npm audit fix
```

### Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
NODE_ENV=development
PORT=8000

# Base de datos MongoDB
DB_USER=your_mongo_user
DB_PASSWORD=your_mongo_password
DB_HOST=your_mongo_host
DB_NAME=troud

# Autenticación JWT
AUTH_JWT_SECRET=your_super_secret_jwt_key

# AWS S3 (para imágenes)
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
```

## Ejecución

### Desarrollo
```bash
npm run dev    # Ejecuta con nodemon (auto-restart)
```

### Producción
```bash
npm start      # Ejecuta en modo producción
```

### Testing
```bash
npm test       # Ejecuta las pruebas
npm run cover  # Ejecuta pruebas con coverage
npm run report # Genera reporte HTML de coverage
```

## Endpoints de la API

### Autenticación
- `POST /api/auth/token` - Obtener token JWT

### Usuarios
- `GET /api/users` - Listar usuarios (requiere auth)
- `GET /api/users/:userId` - Obtener usuario por ID (requiere auth)
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:userId` - Actualizar usuario (requiere auth)
- `DELETE /api/users/:userId` - Eliminar usuario

### Artículos
- `GET /api/articles` - Listar artículos (requiere auth)
- `GET /api/articles/:articleId` - Obtener artículo por ID
- `GET /api/articles/categories/:category/:phoneUser` - Obtener artículos por categoría (requiere auth)
- `GET /api/articles/unreaction/:phoneUser` - Obtener artículos sin reacción (requiere auth)
- `POST /api/articles` - Crear nuevo artículo
- `PUT /api/articles/:articleId` - Actualizar artículo (requiere auth)
- `DELETE /api/articles/:articleId` - Eliminar artículo

### Reacciones
- `GET /api/reactions` - Listar reacciones
- `GET /api/reactions/:reactionId` - Obtener reacción por ID
- `POST /api/reactions` - Crear nueva reacción (requiere auth)
- `DELETE /api/reactions/:reactionId` - Eliminar reacción

### Matches
- `GET /api/matches` - Listar matches
- `GET /api/matches/:matchId` - Obtener match por ID
- `GET /api/matches/phone/:phoneFirst` - Obtener matches por teléfono
- `POST /api/matches` - Crear nuevo match (requiere auth)
- `DELETE /api/matches/:phoneFirst/:phoneSecond` - Eliminar match (requiere auth)

### Imágenes
- `GET /api/images` - Listar imágenes
- `GET /api/images/:imageId` - Obtener imagen por ID
- `POST /api/images` - Subir nueva imagen

## Modelos de Datos

### Usuario
```javascript
{
  userName: String,      // Nombre de usuario (máx 120 chars)
  email: String,         // Email válido
  password: String,      // Contraseña encriptada (8+ chars, mayús, minus, num)
  phone: String,         // Teléfono (7-10 dígitos)
  urlPhoto: String,      // URL de foto de perfil
  profileId: ObjectId    // ID de perfil opcional
}
```

### Artículo
```javascript
{
  phoneOwner: String,    // Teléfono del propietario
  idOwner: ObjectId,     // ID del propietario
  type: String,          // Tipo de prenda
  size: String,          // Talla
  name: String,          // Nombre del artículo
  brand: String,         // Marca
  condition: String,     // Estado (nuevo, usado, etc.)
  gender: String,        // Género (hombre, mujer, unisex)
  description: String,   // Descripción
  color: String,         // Color
  date: String,          // Fecha de creación
  urlPhoto: String,      // URL de la foto
  city: String           // Ciudad
}
```

### Reacción
```javascript
{
  phoneUser: String,     // Teléfono del usuario que reacciona
  phoneOwner: String,    // Teléfono del propietario del artículo
  idArticle: ObjectId,   // ID del artículo
  type: String          // Tipo: "Like", "SuperLike", "DisLike"
}
```

### Match
```javascript
{
  phoneFirst: String,           // Teléfono usuario 1
  nameFirst: String,            // Nombre usuario 1
  phoneSecond: String,          // Teléfono usuario 2
  nameSecond: String,           // Nombre usuario 2
  urlPhotoArticleFirst: String, // URL foto artículo usuario 1
  urlPhotoArticleSecond: String,// URL foto artículo usuario 2
  firstArticleName: String,     // Nombre artículo usuario 1
  secondArticleName: String,    // Nombre artículo usuario 2
  urlChat: String,              // URL del chat (WhatsApp)
  date: String                  // Fecha del match
}
```

## Seguridad

### Autenticación
- **Basic Auth**: Para obtener el token inicial (username=phone, password=password)
- **JWT Bearer**: Para endpoints protegidos (Header: `Authorization: Bearer <token>`)

### Validación
- Todos los inputs son validados con esquemas Joi
- Contraseñas encriptadas con bcrypt (salt rounds: 10)
- Validación de formatos de email y teléfono con regex

### CORS
- Configurado para aceptar todos los orígenes en desarrollo
- Métodos permitidos: GET, POST, PUT, DELETE

## Despliegue

### Vercel (Now.sh)
El proyecto incluye configuración para Vercel en `now.json`:

```bash
# Desplegar a Vercel
vercel --prod
```

### Variables de Entorno en Producción
Configurar en Vercel:
- `@troud-db-password`
- `@troud-db-user`
- `@troud-db-name`
- `@troud-db-host`
- `@troud-auth-admin-username`
- `@troud-auth-admin-password`
- `@troud-auth-admin-email`
- `@troud-auth-jwt-secret`
- `@troud-secret-access-key`
- `@troud-access-key-id`

## Demo

Puedes ver la demo en vivo en: [troud.vercel.app](https://troud.vercel.app)

## Flujo de Uso

1. **Registro**: Usuario se registra con email, teléfono y contraseña
2. **Login**: Obtiene token JWT con credenciales
3. **Subir Artículos**: Usuario sube fotos y datos de sus prendas
4. **Explorar**: Ve artículos de otros usuarios por categoría
5. **Reaccionar**: Da like, superlike o dislike a artículos
6. **Match**: Si hay interés mutuo, se crea un match automáticamente
7. **Chat**: Los usuarios pueden contactarse vía WhatsApp

## Testing

El proyecto incluye tests completos:
- Tests unitarios para servicios
- Tests de integración para rutas
- Tests de esquemas de validación
- Coverage reports con nyc

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.

## Autores

- Alexander Alvarez
- Andrés Felipe Carrión
- Andrés Felipe Chávez
- Felipe Merchán
- Luis Ruiz

---

Para más información sobre la API, consulta la documentación de Swagger en `/api-docs` una vez que la aplicación esté ejecutándose.
