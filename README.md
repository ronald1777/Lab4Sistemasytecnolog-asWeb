# README — Parte 1: Depuración del Servidor Roto
**Autor:** Ronald Catún  
**Curso:** Sistemas y Tecnologías Web — UVG, Semestre 1, 2026

Este documento explica cada error encontrado en `servidor-malo.js`, cómo se corrigió y por qué. El archivo corregido final es `servidor-corregido.js`. Además de la segunda parte del laboratorio numero 4


## Error #1: Content-Type incorrecto en la ruta /info
**Tipo de error:** HTTP / Protocolo

**Qué estaba mal:**  
El Content-Type decía `"application-json"` (con guión) en lugar de `"application/json"` (con barra). Esto hace que el navegador y los clientes HTTP no puedan interpretar correctamente el tipo de respuesta.

**Corregido:**
```js
// Antes:
res.writeHead(200, { "Content-Type": "application-json" })

// Después:
res.writeHead(200, { "Content-Type": "application/json" })
```

**Por qué funciona ahora:**  
El estándar MIME de HTTP usa una barra `/` para separar el tipo y subtipo (`tipo/subtipo`). Con el guión, el encabezado era inválido y los clientes no podían reconocer el formato de la respuesta.

---

## Error #2: Falta `await` en fs.readFile
**Tipo de error:** De Asincronía

**Qué estaba mal:**  
`fs.readFile()` de `fs/promises` devuelve una Promesa. Sin `await`, la variable `texto` recibe el objeto Promise en sí y no el contenido del archivo. Luego ese objeto Promise se pasa a `JSON.stringify`, que lo convierte en `{}` (un objeto vacío), en vez de devolver el JSON real del archivo.

**Corregido:**
```js
// Antes:
const texto = fs.readFile(filePath, "utf-8")

// Después:
const texto = await fs.readFile(filePath, "utf-8")
```

**Por qué funciona ahora:**  
`await` pausa la ejecución de la función hasta que la Promesa se resuelve, y entonces sí entrega el resultado real: el contenido del archivo como string de texto.

---

## Error #3: JSON.stringify aplicado sobre un string
**Tipo de error:** Lógica

**Qué estaba mal:**  
`fs.readFile` con `"utf-8"` ya devuelve el contenido del archivo como un string. Al aplicarle `JSON.stringify()` a ese string, se añaden comillas escapadas alrededor de todo el contenido, produciendo algo como `"{\"nombre\":\"Ronald\"...}"` en lugar de `{"nombre":"Ronald"...}`. Eso ya no es un JSON válido que el cliente pueda usar.

**Corregido:**
```js
// Antes:
res.end(JSON.stringify(texto))

// Después:
res.end(texto)
```

**Por qué funciona ahora:**  
`texto` ya es el string del JSON leído del archivo. Se puede enviar directamente como respuesta sin ninguna transformación adicional.

---

## Error #4: Código HTTP 200 en ruta no encontrada
**Tipo de error:** HTTP / Protocolo
**Qué estaba mal:**  
Cuando ninguna ruta coincide, el servidor respondía con código `200 OK`. El código 200 indica éxito, pero aquí el recurso simplemente no existe. Esto confunde a los clientes que dependen del código de estado para saber si la petición tuvo éxito o no.

**Corregido:**
```js
// Antes:
res.writeHead(200, { "Content-Type": "text/plain" })
res.end("Ruta no encontrada")

// Después:
res.writeHead(404, { "Content-Type": "text/plain" })
res.end("Ruta no encontrada")
```

**Por qué funciona ahora:**  
El código `404 Not Found` es el código HTTP estándar para indicar que la ruta solicitada no existe. Así, herramientas como Postman y los clientes frontend pueden distinguir un éxito de un fallo.

---

## Error #5: Paréntesis de cierre faltantes (error de sintaxis)
**Tipo de error:** De Sintaxis

**Qué estaba mal:**  
Faltaban los paréntesis de cierre `)` tanto en `http.createServer(...)` como en `server.listen(...)`. Node.js no puede parsear el archivo y lanza un `SyntaxError` inmediatamente al intentar ejecutarlo. El servidor ni siquiera llega a iniciar.

**Corregido:**
```js
// Antes le falta el ) al final de cada llamada:
const server = http.createServer(async (req, res) => {
}

server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000")
}

// Después:
const server = http.createServer(async (req, res) => {
})

server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000")
})
```

**Por qué funciona ahora:**  
`http.createServer()` y `server.listen()` son funciones que reciben un callback como argumento. La llamada a la función se abre con `(` y debe cerrarse con `)`. Sin ese cierre, JavaScript no puede terminar de leer la expresión y falla con error de sintaxis.

# PARTE 2
# API REST de Canciones
 
## Descripción

API REST construida con Node.js y Express para gestionar una colección de canciones. Permite crear, leer, actualizar y eliminar canciones, además de filtrarlas por género.

## Instalación y uso INSTRUCCIONES

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm start
```

El servidor corre en: `http://localhost:3000`

---

## Endpoints

### Informativos

| Método | Ruta    | Descripción                          |
|--------|---------|--------------------------------------|
| GET    | `/`     | Página principal con lista de rutas  |
| GET    | `/info` | Información general del API          |

### CRUD de Canciones

| Método | Ruta                  | Descripción                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/api/canciones`      | Obtener todas las canciones              |
| GET    | `/api/canciones?genero=J-Pop` | Filtrar por género               |
| GET    | `/api/canciones/:id`  | Obtener una canción por ID               |
| POST   | `/api/canciones`      | Crear una nueva canción                  |
| PUT    | `/api/canciones/:id`  | Reemplazar una canción completa          |
| PATCH  | `/api/canciones/:id`  | Actualizar solo algunos campos           |
| DELETE | `/api/canciones/:id`  | Eliminar una canción                     |

---

## Campos de una canción

| Campo              | Tipo   | Requerido | Descripción                    |
|--------------------|--------|-----------|--------------------------------|
| `titulo`           | string | SÍ        | Nombre de la canción           |
| `artista`          | string | SÍ        | Nombre del artista o banda     |
| `album`            | string | SÍ        | Álbum al que pertenece         |
| `anio`             | number | SÍ        | Año de lanzamiento             |
| `genero`           | string | SÍ        | Género musical                 |
| `duracion_segundos`| number | SÍ        | Duración en segundos           |

---
