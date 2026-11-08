import { Router, type NextFunction, type Request, type Response } from 'express'
import * as ctrl from '../controllers/libros.controller.js'

// Validación mínima: título y autor son obligatorios
const validar = (req: Request, res: Response, next: NextFunction) => {
  const { titulo, autor } = req.body ?? {}
  if (!titulo?.trim() || !autor?.trim()) {
    res.status(400).json({ message: 'Título y autor son obligatorios' })
    return
  }
  next()
}

const router = Router()

router.get('/', ctrl.listar)
router.get('/:id', ctrl.obtener)
router.post('/', validar, ctrl.crear)
router.put('/:id', validar, ctrl.actualizar)
router.delete('/:id', ctrl.eliminar)

export default router
