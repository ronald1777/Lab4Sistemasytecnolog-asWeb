import http from "http"
import fs from "fs/promises"
import path from "path"

const PORT = 3000

// Se agrego el parentesis de cierre que faltaba al final del createServer
const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Servidor activo")
    return
  }

  if (req.url === "/info") {
    // ERROR 1 CORREGIDO: "application-json" -> "application/json"
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end("Ruta de información")
    return
  }

  if (req.url === "/api/student") {
    const filePath = path.join(process.cwd(), "datos.json")
    // ERROR 2 CORREGIDO: faltaba "await" antes de fs.readFile
    const texto = await fs.readFile(filePath, "utf-8")
    res.writeHead(200, { "Content-Type": "application/json" })
    // ERROR 3 CORREGIDO: texto ya es string, no hay que usar JSON.stringify
    res.end(texto)
    return
  }

  // ERROR 4 CORREGIDO: código 404 en lugar de 200 para ruta no encontrada
  res.writeHead(404, { "Content-Type": "text/plain" })
  res.end("Ruta no encontrada")
// ERROR 5 CORREGIDO: faltaba el parentesis de cierre del http.createServer(...)
})

server.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:3000")
// ERROR 5 (parte 2): faltaba el parentesis de cierre del server.listen(...)
})
