# 🗄️ Guía Completa: Configurar MongoDB para Troud

## 🚀 **OPCIÓN 1: MONGODB ATLAS (RECOMENDADO)**

### **Paso 1: Crear Cuenta MongoDB Atlas**

1. **Ir a [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Hacer clic en "Try Free"**
3. **Registrarse con:**
   - Email
   - Google
   - GitHub
4. **Verificar email** si es necesario

### **Paso 2: Crear Cluster**

1. **Seleccionar "Build a Database"**
2. **Elegir "M0 Sandbox" (GRATIS)**
   - ✅ 512 MB storage
   - ✅ Shared RAM
   - ✅ No credit card required
3. **Configurar Provider & Region:**
   - Provider: AWS (recomendado)
   - Region: Más cercana a tu ubicación
4. **Cluster Name:** `troud-cluster`
5. **Crear Cluster** (toma 1-3 minutos)

### **Paso 3: Configurar Seguridad**

#### **3.1 Crear Usuario de Base de Datos:**
1. **Security → Database Access**
2. **Add New Database User**
3. **Configuración:**
   ```
   Authentication Method: Password
   Username: troud_admin
   Password: [Generar password seguro]
   Database User Privileges: Atlas Admin
   ```
4. **Add User**

#### **3.2 Configurar Network Access:**
1. **Security → Network Access**
2. **Add IP Address**
3. **Opciones:**
   - **Para desarrollo:** `0.0.0.0/0` (cualquier IP)
   - **Para producción:** Tu IP específica
4. **Confirm**

### **Paso 4: Obtener String de Conexión**

1. **Databases → Connect**
2. **Connect your application**
3. **Driver:** Node.js
4. **Version:** 4.1 or later
5. **Copiar connection string:**
   ```
   mongodb+srv://troud_admin:<password>@troud-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### **Paso 5: Configurar Variables de Entorno**

**Crear archivo `.env` en la raíz del proyecto:**
```env
# 🌍 Environment Configuration for Troud API

# 🏃‍♀️ Server Configuration
NODE_ENV=development
PORT=3000

# 🗄️ MongoDB Atlas Configuration
DB_USER=troud_admin
DB_PASSWORD=tu_password_generado_aqui
DB_HOST=troud-cluster.xxxxx.mongodb.net
DB_NAME=troud_development

# 🔐 Authentication
AUTH_JWT_SECRET=tu_jwt_secret_super_secreto_cambiar_en_produccion

# ☁️ AWS S3 Configuration (for image uploads)
ACCESS_KEY_ID=tu_aws_access_key_id
SECRET_ACCESS_KEY=tu_aws_secret_access_key
```

**⚠️ IMPORTANTE:** 
- Reemplaza `tu_password_generado_aqui` con el password real de MongoDB Atlas
- Reemplaza `xxxxx` con tu cluster ID real
- Nunca subas el archivo `.env` a git (ya está en .gitignore)

---

## 🖥️ **OPCIÓN 2: MONGODB LOCAL**

### **Paso 1: Instalar MongoDB**

#### **MacOS:**
```bash
# Instalar con Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Iniciar servicio
brew services start mongodb/brew/mongodb-community
```

#### **Ubuntu/Linux:**
```bash
# Importar clave GPG
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Agregar repositorio
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod
```

⚠️ **NOTA IMPORTANTE**: Este proyecto usa MongoDB driver 6.x que es compatible con MongoDB Server 4.4+

#### **Windows:**
1. Descargar desde [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Ejecutar installer
3. Configurar como servicio de Windows

### **Paso 2: Configurar Local**

**Variables de entorno para local:**
```env
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_NAME=troud_local
```

---

## 🐳 **OPCIÓN 3: MONGODB CON DOCKER**

### **Paso 1: Crear docker-compose.yml**

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: troud_mongo
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: troud_local
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

volumes:
  mongodb_data:
```

### **Paso 2: Crear script de inicialización**

**Archivo: `mongo-init.js`**
```javascript
db = db.getSiblingDB('troud_local');

db.createUser({
  user: 'troud_user',
  pwd: 'troud_password',
  roles: [
    {
      role: 'readWrite',
      db: 'troud_local'
    }
  ]
});

// Crear colecciones
db.createCollection('users');
db.createCollection('articles');
db.createCollection('reactions');
db.createCollection('matches');
db.createCollection('images');
```

### **Paso 3: Ejecutar Docker**

```bash
# Iniciar MongoDB
docker-compose up -d

# Verificar que está corriendo
docker ps
```

---

## 🔧 **CONFIGURACIÓN DEL PROYECTO**

### **Actualizar Conexión MongoDB**

**Archivo: `lib/mongo.js` (actualización):**
```javascript
const { MongoClient, ObjectID } = require('mongodb');
const { config } = require('../config');

// Parámetros de conexión
const DB_USER = config.dbUser;
const DB_PASSWD = config.dbPassword;
const BD_HOST = config.dbHost;
const BD_NAME = config.dbName;

// URL de conexión mejorada
let MONGO_URI;

if (process.env.NODE_ENV === 'production') {
  // Para MongoDB Atlas
  MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${BD_HOST}/${BD_NAME}?retryWrites=true&w=majority`;
} else {
  // Para desarrollo local
  if (BD_HOST === 'localhost') {
    MONGO_URI = `mongodb://${DB_USER}:${DB_PASSWD}@localhost:27017/${BD_NAME}?authSource=admin`;
  } else {
    // Para Atlas en desarrollo
    MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${BD_HOST}/${BD_NAME}?retryWrites=true&w=majority`;
  }
}

console.log('Connecting to MongoDB:', BD_HOST);

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    this.dbName = BD_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            console.error('MongoDB connection error:', err);
            reject(err);
          }

          console.log('✅ Connected successfully to MongoDB');
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  // ... resto de métodos existentes
}

module.exports = MongoLib;
```

---

## 🌱 **DATOS DE PRUEBA**

### **Crear Script de Seeding**

**Archivo: `scripts/seed-database.js`**
```javascript
const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  const mongoDB = new MongoLib();
  
  try {
    console.log('🌱 Seeding database...');

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('Password123', 10);
    
    const testUser = {
      userName: 'Test User Juan',
      email: 'testuser@example.com',
      phone: '3001234567',
      password: hashedPassword,
      urlPhoto: 'https://via.placeholder.com/150',
      profileId: null
    };

    const userId = await mongoDB.create('users', testUser);
    console.log('✅ Test user created:', userId);

    // Crear artículo de prueba
    const testArticle = {
      phoneOwner: '3001234567',
      idOwner: userId.toString(),
      type: 'Camiseta',
      size: 'M',
      name: 'Camiseta Nike Básica',
      brand: 'Nike',
      condition: 'Usado - Buen estado',
      gender: 'Unisex',
      description: 'Camiseta deportiva en excelente estado',
      color: 'Azul',
      date: new Date().toLocaleString(),
      urlPhoto: 'https://via.placeholder.com/300',
      city: 'Bogotá'
    };

    const articleId = await mongoDB.create('articles', testArticle);
    console.log('✅ Test article created:', articleId);

    console.log('🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
```

### **Agregar Script al package.json**

```json
{
  "scripts": {
    "seed": "node scripts/seed-database.js",
    "seed:reset": "node scripts/reset-database.js"
  }
}
```

---

## 🧪 **TESTING DE CONEXIÓN**

### **Script de Test de Conexión**

**Archivo: `scripts/test-connection.js`**
```javascript
const MongoLib = require('../lib/mongo');

async function testConnection() {
  const mongoDB = new MongoLib();
  
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const db = await mongoDB.connect();
    console.log('✅ Connected to database:', db.databaseName);
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));
    
    // Test básico
    const stats = await db.stats();
    console.log('📊 Database stats:', {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize
    });
    
    console.log('🎉 Connection test successful!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();
```

---

## 📋 **CHECKLIST DE CONFIGURACIÓN**

### **Para MongoDB Atlas:**
- [ ] Cuenta creada en MongoDB Atlas
- [ ] Cluster M0 (gratuito) creado
- [ ] Usuario de base de datos configurado
- [ ] Network access configurado (0.0.0.0/0 para desarrollo)
- [ ] Connection string obtenido
- [ ] Variables de entorno actualizadas en `.env`
- [ ] Conexión probada con `npm run test:connection`

### **Para MongoDB Local:**
- [ ] MongoDB instalado localmente
- [ ] Servicio MongoDB iniciado
- [ ] Usuario y base de datos creados
- [ ] Variables de entorno configuradas
- [ ] Conexión probada

### **Para todos:**
- [ ] Archivo `lib/mongo.js` actualizado
- [ ] Script de seeding creado
- [ ] Datos de prueba insertados
- [ ] API funcionando con nueva DB

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Authentication failed"**
```bash
# Verificar credenciales
# Asegurarse de que el password no tenga caracteres especiales
# Usar URL encoding si es necesario
```

### **Error: "Connection timeout"**
```bash
# Verificar network access en Atlas
# Confirmar que tu IP está whitelisteada
# Comprobar firewall local
```

### **Error: "Database not found"**
```bash
# MongoDB Atlas crea la DB automáticamente al insertar datos
# Ejecutar: npm run seed
```

---

## 🎯 **PRÓXIMOS PASOS**

1. **Elegir opción** (Atlas recomendado)
2. **Seguir pasos específicos**
3. **Configurar variables de entorno**
4. **Probar conexión**
5. **Insertar datos de prueba**
6. **Verificar API funcionando**

**¿Qué opción prefieres? Te ayudo con los pasos específicos.** 