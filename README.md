# Gestor de residencia universitaria

# GRU Backend

Sistema backend para la Gestión de Residencia Universitaria (GRU), desarrollado con NestJS, TypeScript y PostgreSQL.

El proyecto permite administrar estudiantes, tareas, permisos de salida, feedbacks y reportes dentro de una residencia universitaria.

---

# Tecnologías utilizadas

## Backend

- NestJS
- TypeScript
- Node.js
- PostgreSQL
- TypeORM

## Validaciones y documentación

- class-validator
- class-transformer
- Swagger

## Testing y calidad de código

- Jest
- ESLint
- Prettier

---

# Dependencias principales

| Dependencia | Uso |
|---|---|
| @nestjs/common | Funcionalidades principales de NestJS |
| @nestjs/typeorm | Integración con TypeORM |
| typeorm | ORM para manejo de base de datos |
| pg | Driver de PostgreSQL |
| class-validator | Validación de DTOs |
| class-transformer | Transformación de datos |
| @nestjs/swagger | Documentación Swagger |
| pdfkit | Generación de PDFs |
| bcrypt | Encriptación de contraseñas |

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/gru-backend.git
```

## 2. Entrar al proyecto

```bash
cd gru-backend
```

## 3. Instalar dependencias

```bash
npm install
```

---

# Configuración del entorno

Crear un archivo `.env` en la raíz del proyecto.

## Ejemplo

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=gru_db
PORT=3000
```

---

# Ejecución del proyecto

## Desarrollo

```bash
npm run start:dev
```

## Producción

```bash
npm run build
npm run start:prod
```

## Debug

```bash
npm run start:debug
```

---

# Scripts disponibles

| Script | Descripción |
|---|---|
| npm run start | Inicia la aplicación |
| npm run start:dev | Ejecuta el proyecto en desarrollo |
| npm run start:debug | Ejecuta el proyecto en modo debug |
| npm run build | Compila el proyecto |
| npm run lint | Corrige errores de ESLint |
| npm run test | Ejecuta pruebas |
| npm run test:watch | Ejecuta pruebas en modo watch |
| npm run test:cov | Genera cobertura de pruebas |
| npm run test:e2e | Ejecuta pruebas end-to-end |

---

# Arquitectura del proyecto

El proyecto utiliza una arquitectura modular basada en NestJS.

## Módulos principales

- Users
- Students
- Tasks
- Feedbacks
- Exit Permits
- Reports
- Auth

---

# Relaciones implementadas

## Student ↔ Feedback

- Un estudiante puede tener múltiples feedbacks.
- Un feedback pertenece a un estudiante.

### Relación TypeORM

```ts
@OneToMany(() => Feedback, feedback => feedback.student)
feedbacks!: Feedback[];
```

```ts
@ManyToOne(() => StudentEntity, student => student.feedbacks)
@JoinColumn({ name: 'student_id' })
student!: StudentEntity;
```

---

# API REST

La API utiliza arquitectura REST.

## Base URL

```bash
http://localhost:3000/api/v1
```

---

# Documentación Swagger

La documentación interactiva está disponible en:

```bash
http://localhost:3000/api
```

---

# Ejemplos de endpoints

## Obtener estudiantes

```http
GET /api/v1/students
```

---

## Obtener estudiante por ID

```http
GET /api/v1/students/4
```

---

## Crear estudiante

```http
POST /api/v1/students
```

### Body

```json
{
  "user_id": 2,
  "student_code": "STU-001",
  "first_name": "Antonio",
  "last_name": "Baez",
  "career": "Ingeniería en Sistemas",
  "room_number": "A-101",
  "scholarship_status": "Active"
}
```

---

## Obtener feedbacks

```http
GET /api/v1/feedbacks
```

---

## Crear feedback

```http
POST /api/v1/feedbacks
```

### Body

```json
{
  "student_id": 4,
  "type": "Observación",
  "content": "Excelente disciplina en la residencia",
  "is_read": true
}
```

---

## Obtener reportes de tareas

```http
GET /api/v1/reports/tasks?userId=2&taskType=Cleaning&userName=Antonio
```

---

# Ejemplo de respuesta

```json
[
  {
    "id": 1,
    "student": {
      "id": 4,
      "first_name": "Antonio",
      "last_name": "Baez"
    },
    "type": "Observación",
    "content": "Excelente disciplina",
    "is_read": true
  }
]
```

---

# Validaciones implementadas

El proyecto utiliza DTOs y class-validator para validar:

- IDs numéricos
- Campos obligatorios
- Longitud mínima de texto
- Tipos booleanos
- Relaciones entre entidades

---

# Testing

## Ejecutar pruebas unitarias

```bash
npm run test
```

## Ejecutar pruebas con cobertura

```bash
npm run test:cov
```

## Ejecutar pruebas e2e

```bash
npm run test:e2e
```

---

# Linting y formato

## ESLint

```bash
npm run lint
```

## Prettier

```bash
npm run format
```

---

# Estado del proyecto

Proyecto backend en desarrollo para la automatización y gestión de procesos dentro de una residencia universitaria.

---

# Autores

Albert Gabriel Centeno Aguilar,
Bryan Emanuel Flores Mejia,
Lennis Adonis Mercado Davila,
Rodrigo Antonio Baez Ruiz,

Proyecto académico - Gestión de Residencia Universitaria (GRU)
