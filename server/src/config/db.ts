import pg from 'pg'

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
})

// Crea la tabla y algunos registros de ejemplo la primera vez que arranca
export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS libros (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(150) NOT NULL,
      autor VARCHAR(120) NOT NULL,
      genero VARCHAR(60),
      anio INTEGER,
      leido BOOLEAN NOT NULL DEFAULT false,
      creado_en TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)

  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM libros')
  if (rows[0].total === 0) {
    await pool.query(`
      INSERT INTO libros (titulo, autor, genero, anio, leido) VALUES
      ('Cien años de soledad', 'Gabriel García Márquez', 'Novela', 1967, true),
      ('Pedro Páramo', 'Juan Rulfo', 'Novela', 1955, true),
      ('El principito', 'Antoine de Saint-Exupéry', 'Fábula', 1943, false),
      ('Clean Code', 'Robert C. Martin', 'Tecnología', 2008, false)
    `)
  }
}
