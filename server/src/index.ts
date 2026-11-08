import express, { type NextFunction, type Request, type Response } from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initDb } from './config/db.js'
import librosRoutes from './routes/libros.routes.js'

const app = express()
const PORT = Number(process.env.PORT) || 3000
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')

app.use(express.json())
app.use('/api/libros', librosRoutes)

// Frontend React compilado
app.use(express.static(publicDir))
app.use((_req, res) => res.sendFile(path.join(publicDir, 'index.html')))

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ message: 'Error interno del servidor' })
})

initDb()
  .then(() => app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`)))
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos', err)
    process.exit(1)
  })
