import type { Request, Response } from 'express'
import * as service from '../services/libros.service.js'

const noEncontrado = (res: Response) => res.status(404).json({ message: 'Libro no encontrado' })

export const listar = async (_req: Request, res: Response) => {
  res.json(await service.listar())
}

export const obtener = async (req: Request, res: Response) => {
  const libro = await service.obtener(Number(req.params.id))
  libro ? res.json(libro) : noEncontrado(res)
}

export const crear = async (req: Request, res: Response) => {
  res.status(201).json(await service.crear(req.body))
}

export const actualizar = async (req: Request, res: Response) => {
  const libro = await service.actualizar(Number(req.params.id), req.body)
  libro ? res.json(libro) : noEncontrado(res)
}

export const eliminar = async (req: Request, res: Response) => {
  const ok = await service.eliminar(Number(req.params.id))
  ok ? res.status(204).end() : noEncontrado(res)
}
