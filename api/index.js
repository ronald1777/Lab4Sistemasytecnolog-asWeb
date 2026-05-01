import express from "express"
import { uid } from "uid"

const app = express()
const PORT = 3000

app.use(express.json())

let canciones = [
  {
    id: uid(),
    titulo: "COLORS",
    artista: "FLOW",
    album: "FLOW THE BEST ~e-motion~",
    anio: 2004,
    genero: "J-Rock",
    duracion_segundos: 228
  },
  {
    id: uid(),
    titulo: "Hikari No Hahen",
    artista: "Yu Takahashi",
    album: "Hikari No Hahen",
    anio: 2017,
    genero: "J-Pop",
    duracion_segundos: 274
  },
  {
    id: uid(),
    titulo: "Eye in the Sky",
    artista: "The Alan Parsons Project",
    album: "Eye in the Sky",
    anio: 1982,
    genero: "Art Rock",
    duracion_segundos: 237
  },
  {
    id: uid(),
    titulo: "Bored To Death",
    artista: "blink-182",
    album: "California",
    anio: 2016,
    genero: "Pop Punk",
    duracion_segundos: 193
  },
  {
    id: uid(),
    titulo: "Hanauta",
    artista: "GReeeeN",
    album: "Hanauta",
    anio: 2013,
    genero: "J-Pop",
    duracion_segundos: 262
  }
]

app.get("/", (req, res) => {
  res.status(200).send(`
    <html>
      <head><style>body { font-family: Arial; padding: 20px; } code { background: #eee; padding: 2px 6px; border-radius: 4px; }</style></head>
      <body>
        <h1> API de Canciones - Ronald Catún</h1>
        <h2>Endpoints disponibles:</h2>
        <h3>Informativos</h3>
        <ul>
          <li><code>GET /</code> - Esta página</li>
          <li><code>GET /info</code> - Información del API</li>
        </ul>
        <h3>CRUD de Canciones</h3>
        <ul>
          <li><code>GET /api/canciones</code> - Obtener todas las canciones</li>
          <li><code>GET /api/canciones?genero=J-Pop</code> - Filtrar por género</li>
          <li><code>GET /api/canciones/:id</code> - Obtener una canción por ID</li>
          <li><code>POST /api/canciones</code> - Crear una nueva canción</li>
          <li><code>PUT /api/canciones/:id</code> - Reemplazar una canción completa</li>
          <li><code>PATCH /api/canciones/:id</code> - Actualizar campos específicos</li>
          <li><code>DELETE /api/canciones/:id</code> - Eliminar una canción</li>
        </ul>
      </body>
    </html>
  `)
})

app.get("/info", (req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      nombre: "API de Canciones",
      autor: "Ronald Catún",
      version: "1.0.0",
      curso: "Sistemas y Tecnologías Web - UVG",
      descripcion: "API REST para gestionar una colección de canciones",
      total_canciones: canciones.length
    }
  })
})

app.get("/api/canciones", (req, res) => {
  const { genero } = req.query

  if (genero) {
    const resultado = canciones.filter(
      (c) => c.genero.toLowerCase() === genero.toLowerCase()
    )
    return res.status(200).json({ ok: true, data: resultado })
  }

  res.status(200).json({ ok: true, data: canciones })
})

app.get("/api/canciones/:id", (req, res) => {
  const { id } = req.params
  const cancion = canciones.find((c) => c.id === id)

  if (!cancion) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró ninguna canción con el ID: ${id}`
    })
  }

  res.status(200).json({ ok: true, data: cancion })
})


app.post("/api/canciones", (req, res) => {
  const { titulo, artista, album, anio, genero, duracion_segundos } = req.body

  if (!titulo || !artista || !album || !anio || !genero || !duracion_segundos) {
    return res.status(400).json({
      ok: false,
      error: "Faltan campos obligatorios. Se necesitan: titulo, artista, album, anio, genero, duracion_segundos"
    })
  }

  const nuevaCancion = {
    id: uid(),
    titulo,
    artista,
    album,
    anio,
    genero,
    duracion_segundos
  }

  canciones.push(nuevaCancion)

  res.status(201).json({ ok: true, data: nuevaCancion })
})


app.put("/api/canciones/:id", (req, res) => {
  const { id } = req.params
  const { titulo, artista, album, anio, genero, duracion_segundos } = req.body

  const indice = canciones.findIndex((c) => c.id === id)

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró ninguna canción con el ID: ${id}`
    })
  }

  if (!titulo || !artista || !album || !anio || !genero || !duracion_segundos) {
    return res.status(400).json({
      ok: false,
      error: "PUT reemplaza el objeto completo. Se necesitan todos los campos: titulo, artista, album, anio, genero, duracion_segundos"
    })
  }

  canciones[indice] = { id, titulo, artista, album, anio, genero, duracion_segundos }

  res.status(200).json({ ok: true, data: canciones[indice] })
})

app.patch("/api/canciones/:id", (req, res) => {
  const { id } = req.params

  const indice = canciones.findIndex((c) => c.id === id)

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró ninguna canción con el ID: ${id}`
    })
  }

  canciones[indice] = { ...canciones[indice], ...req.body }

  res.status(200).json({ ok: true, data: canciones[indice] })
})


app.delete("/api/canciones/:id", (req, res) => {
  const { id } = req.params
  const indice = canciones.findIndex((c) => c.id === id)

  if (indice === -1) {
    return res.status(404).json({
      ok: false,
      error: `No se encontró ninguna canción con el ID: ${id}`
    })
  }

  const cancionEliminada = canciones[indice]
  canciones = canciones.filter((c) => c.id !== id)

  res.status(200).json({
    ok: true,
    mensaje: "Canción eliminada correctamente",
    data: cancionEliminada
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    ruta: req.url,
    metodo: req.method,
    sugerencia: "Visita / para ver los endpoints disponibles"
  })
})

app.listen(PORT, () => {
  console.log(`🎵 API de Canciones corriendo en http://localhost:${PORT}`)
  console.log(`📋 Ver endpoints: http://localhost:${PORT}/`)
})
