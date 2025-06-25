# 🏗️ Guía Completa: Configuración del Esquema de Base de Datos

## 📋 **RESUMEN DEL ESQUEMA**

Troud utiliza **5 colecciones principales** en MongoDB con validación de esquemas y índices optimizados:

### **🗂️ COLECCIONES:**
1. **👤 users** - Información de usuarios registrados
2. **👕 articles** - Artículos de ropa publicados  
3. **❤️ reactions** - Likes, SuperLikes, DisLikes
4. **💕 matches** - Coincidencias entre usuarios
5. **🖼️ images** - Metadatos de imágenes (futuro)

---

## 🚀 **CONFIGURACIÓN RÁPIDA**

### **1️⃣ Configurar Variables de Entorno**
```bash
# Asegúrate de tener tu archivo .env configurado
# Ver: MONGODB_SETUP_GUIDE.md
```

### **2️⃣ Configurar Esquema Completo**
```bash
# Opción A: Setup completo (recomendado)
npm run db:full-setup

# Opción B: Paso a paso
npm run test:connection     # 1. Probar conexión
npm run schema:setup        # 2. Crear esquemas
npm run seed               # 3. Insertar datos de prueba
```

### **3️⃣ Verificar Configuración**
```bash
npm run test:connection
```

---

## 📊 **DETALLE DE COLECCIONES**

### **👤 USERS COLLECTION**

**Campos Requeridos:**
- `userName` (string, max 120) - Nombre de usuario
- `phone` (string, 7-10 dígitos) - Teléfono único
- `password` (string, min 8) - Contraseña hasheada
- `urlPhoto` (string) - URL de foto de perfil

**Campos Opcionales:**
- `email` (string, validado) - Email con regex
- `profileId` (ObjectId) - Referencia a perfil extendido
- `createdAt` (Date) - Timestamp de creación
- `updatedAt` (Date) - Timestamp de actualización

**Índices:**
- `phone` (único) - Para login y búsquedas
- `email` - Para búsquedas por email
- `createdAt` - Para ordenar por fecha

---

### **👕 ARTICLES COLLECTION**

**Campos Requeridos:**
- `phoneOwner` (string) - Teléfono del dueño
- `idOwner` (ObjectId) - ID del usuario dueño
- `type` (string) - Tipo de prenda
- `size` (string) - Talla
- `name` (string) - Nombre del artículo
- `brand` (string) - Marca
- `condition` (enum) - Estado: Nuevo, Usado - Excelente/Buen/Regular estado
- `gender` (enum) - Hombre, Mujer, Unisex, Niño, Niña
- `description` (string) - Descripción
- `color` (string) - Color principal
- `urlPhoto` (string) - URL de imagen
- `city` (string) - Ciudad de ubicación

**Índices Optimizados:**
- Individuales: `phoneOwner`, `idOwner`, `type`, `gender`, `city`, `brand`, `size`
- Compuestos: `type + gender + city`, `phoneOwner + createdAt`

---

### **❤️ REACTIONS COLLECTION**

**Funcionalidad:** Sistema tipo Tinder para reaccionar a artículos

**Campos Requeridos:**
- `type` (enum) - Like, SuperLike, DisLike
- `phoneOwner` (string) - Teléfono del dueño del artículo
- `phoneUser` (string) - Teléfono del usuario que reacciona
- `idArticle` (ObjectId) - ID del artículo

**Restricciones:**
- **Índice único** en `phoneUser + idArticle` (evita reacciones duplicadas)
- Solo una reacción por usuario por artículo

**Índices para Matches:**
- `phoneOwner + phoneUser` - Detectar reacciones mutuas
- `idArticle + type` - Contar likes por artículo

---

### **💕 MATCHES COLLECTION**

**Funcionalidad:** Se crea automáticamente cuando dos usuarios se dan like mutuamente

**Campos Requeridos:**
- `nameFirst` (string) - Nombre del primer usuario
- `phoneFirst` (string) - Teléfono del primer usuario
- `nameSecond` (string) - Nombre del segundo usuario  
- `phoneSecond` (string) - Teléfono del segundo usuario

**Campos Opcionales:**
- `urlPhotoArticleFirst/Second` - URLs de los artículos
- `firstArticleName/secondArticleName` - Nombres de artículos
- `urlChat` - URL del chat
- `date` - Fecha del match

**Restricción:**
- **Índice único** en `phoneFirst + phoneSecond` (evita matches duplicados)

---

### **🖼️ IMAGES COLLECTION** (Preparado para futuro)

**Funcionalidad:** Metadatos de imágenes para escalabilidad

**Campos:**
- `url` (string) - URL de la imagen
- `entityType` (enum) - user, article
- `entityId` (ObjectId) - ID de la entidad
- `filename`, `size`, `mimeType` - Metadatos
- `uploadedAt` - Timestamp de subida

---

## 🛠️ **SCRIPTS DISPONIBLES**

### **🔍 Testing y Verificación:**
```bash
npm run test:connection    # Probar conexión a MongoDB
```

### **🏗️ Configuración de Esquema:**
```bash
npm run schema:setup       # Crear colecciones con validaciones e índices
npm run seed              # Insertar datos de prueba
npm run db:full-setup     # Setup completo (schema + seed)
```

### **🗑️ Limpieza:**
```bash
npm run db:reset          # ⚠️ ELIMINAR todas las colecciones
```

---

## 📈 **OPTIMIZACIONES DE RENDIMIENTO**

### **✅ Implementadas:**

**1. Validación de Esquema a Nivel de Base de Datos**
- MongoDB valida automáticamente los datos
- Previene datos corruptos
- Mejora la integridad

**2. Índices Estratégicos**
- **Únicos:** `users.phone`, `reactions(phoneUser+idArticle)`, `matches(phoneFirst+phoneSecond)`
- **Compuestos:** Para queries complejas frecuentes
- **Individuales:** Para búsquedas y filtros

**3. Enum Constraints**
- `condition`: Solo valores válidos
- `gender`: Categorización estricta
- `reaction.type`: Solo Like/SuperLike/DisLike

**4. Prevención de Duplicados**
- No hay usuarios con mismo teléfono
- No hay reacciones duplicadas
- No hay matches duplicados

---

## 🚨 **COMANDOS DE EMERGENCIA**

### **🔄 Reset Completo:**
```bash
npm run db:reset           # Eliminar todo
npm run db:full-setup      # Recrear desde cero
```

### **🔧 Solo Recrear Índices:**
```bash
npm run schema:setup       # Recrear solo estructura (no datos)
```

### **📊 Ver Estado Actual:**
```bash
npm run test:connection    # Muestra resumen de colecciones
```

---

## 🎯 **DATOS DE PRUEBA INCLUIDOS**

Después de ejecutar `npm run seed`, tendrás:

  ### **👥 2 Usuarios:**
  1. **Test User Juan** (`3001234567`)
     - Email: testuser@example.com
     - Password: TestPassword123!

  2. **Test User Maria** (`3009876543`)
     - Email: testmaria@example.com
     - Password: TestMaria123!

### **👕 4 Artículos:**
- Camiseta Nike (Usuario 1)
- Jeans Levi's (Usuario 1)
- Chaqueta Adidas (Usuario 1)
- Vestido Zara (Usuario 2)

### **🔄 Listo para Testing:**
- Crear reacciones entre usuarios
- Generar matches automáticos
- Probar toda la funcionalidad

---

## 🔍 **VERIFICACIÓN POST-SETUP**

Después del setup, deberías ver algo así:

```
📊 DATABASE SUMMARY:
==================

📋 USERS:
   Documents: 2
   Indexes: 4
   Custom indexes: phone_1, email_1, createdAt_-1

📋 ARTICLES:
   Documents: 4
   Indexes: 11
   Custom indexes: phoneOwner_1, idOwner_1, type_1, gender_1, city_1, brand_1, size_1, createdAt_-1, type_1_gender_1_city_1, phoneOwner_1_createdAt_-1

📋 REACTIONS:
   Documents: 0
   Indexes: 8
   Custom indexes: idArticle_1, phoneOwner_1, phoneUser_1, type_1, createdAt_-1, phoneOwner_1_phoneUser_1, idArticle_1_type_1, phoneUser_1_idArticle_1

📋 MATCHES:
   Documents: 0
   Indexes: 4
   Custom indexes: phoneFirst_1, phoneSecond_1, createdAt_-1, phoneFirst_1_phoneSecond_1

📋 IMAGES:
   Documents: 0
   Indexes: 3
   Custom indexes: entityType_1_entityId_1, uploadedAt_-1

🎯 PERFORMANCE OPTIMIZATIONS:
  ✅ Unique constraints on critical fields
  ✅ Compound indexes for complex queries
  ✅ Schema validation for data integrity
  ✅ Proper indexing for search operations
```

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Connection failed"**
```bash
# 1. Verificar .env
cat .env

# 2. Probar conexión básica
npm run test:connection

# 3. Verificar MongoDB Atlas network access
```

### **Error: "Collection already exists"**
```bash
# Normal - el script detecta colecciones existentes
# Si necesitas recrear:
npm run db:reset
npm run schema:setup
```

### **Error: "Validation failed"**
```bash
# Los datos no cumplen el esquema
# Verificar que los datos coinciden con las validaciones
```

---

## 🎉 **¡LISTO!**

Con esta configuración tienes:
- ✅ Base de datos completamente estructurada
- ✅ Validaciones automáticas
- ✅ Índices optimizados para rendimiento
- ✅ Datos de prueba listos
- ✅ Scripts de mantenimiento

**Tu API está lista para manejar miles de usuarios y artículos eficientemente.** 