import { pool } from '../config/db.js'

export type Libro = {
  titulo: string
  autor: string
  genero?: string | null
  anio?: number | null
  leido?: boolean
}

export const listar = async () => {
  const { rows } = await pool.query('SELECT * FROM libros ORDER BY id DESC')
  return rows
}

export const obtener = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM libros WHERE id = $1', [id])
  return rows[0] ?? null
}

export const crear = async (l: Libro) => {
  const { rows } = await pool.query(
    'INSERT INTO libros (titulo, autor, genero, anio, leido) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [l.titulo, l.autor, l.genero ?? null, l.anio ?? null, l.leido ?? false]
  )
  return rows[0]
}

export const actualizar = async (id: number, l: Libro) => {
  const { rows } = await pool.query(
    'UPDATE libros SET titulo = $1, autor = $2, genero = $3, anio = $4, leido = $5 WHERE id = $6 RETURNING *',
    [l.titulo, l.autor, l.genero ?? null, l.anio ?? null, l.leido ?? false, id]
  )
  return rows[0] ?? null
}

export const eliminar = async (id: number) => {
  const { rowCount } = await pool.query('DELETE FROM libros WHERE id = $1', [id])
  return (rowCount ?? 0) > 0
}
