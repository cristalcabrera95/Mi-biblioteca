import { useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { Tag } from 'primereact/tag'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

const API = '/api/libros'
const GENEROS = ['Novela', 'Cuento', 'Poesía', 'Fábula', 'Ensayo', 'Historia', 'Tecnología', 'Ciencia', 'Otro']
const VACIO = { titulo: '', autor: '', genero: null, anio: null, leido: false }

const pedir = async (url, options) => {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Ocurrió un error')
  return res.status === 204 ? null : res.json()
}

export default function App() {
  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState(null) // libro en edición o nuevo
  const [detalle, setDetalle] = useState(null) // libro consultado individualmente
  const [guardando, setGuardando] = useState(false)
  const toast = useRef(null)

  const avisar = (severity, detail) => toast.current.show({ severity, summary: severity === 'error' ? 'Error' : 'Listo', detail, life: 3000 })

  const cargar = async () => {
    setCargando(true)
    try {
      setLibros(await pedir(API))
    } catch (e) {
      avisar('error', e.message)
    }
    setCargando(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const verDetalle = async (id) => {
    try {
      setDetalle(await pedir(`${API}/${id}`))
    } catch (e) {
      avisar('error', e.message)
    }
  }

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const esNuevo = !form.id
      await pedir(esNuevo ? API : `${API}/${form.id}`, { method: esNuevo ? 'POST' : 'PUT', body: JSON.stringify(form) })
      avisar('success', esNuevo ? 'Libro agregado' : 'Libro actualizado')
      setForm(null)
      cargar()
    } catch (err) {
      avisar('error', err.message)
    }
    setGuardando(false)
  }

  const eliminar = (libro) =>
    confirmDialog({
      header: 'Eliminar libro',
      message: `¿Seguro que deseas eliminar "${libro.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await pedir(`${API}/${libro.id}`, { method: 'DELETE' })
          avisar('success', 'Libro eliminado')
          setDetalle(null)
          cargar()
        } catch (e) {
          avisar('error', e.message)
        }
      }
    })

  const campo = (nombre, valor) => setForm({ ...form, [nombre]: valor })
  const leidos = libros.filter((l) => l.leido).length

  const acciones = (libro) => (
    <div className="flex justify-content-end acciones">
      <Button icon="pi pi-eye" rounded text aria-label="Ver" tooltip="Ver" onClick={() => verDetalle(libro.id)} />
      <Button icon="pi pi-pencil" rounded text severity="secondary" aria-label="Editar" tooltip="Editar" onClick={() => setForm({ ...libro })} />
      <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Eliminar" tooltip="Eliminar" onClick={() => eliminar(libro)} />
    </div>
  )

  const estado = (libro) => <Tag value={libro.leido ? 'Leído' : 'Pendiente'} severity={libro.leido ? 'success' : 'warning'} rounded />

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      <header className="hero py-5">
        <div className="contenedor">
          <div className="flex align-items-center gap-2 mb-2">
            <i className="pi pi-book text-2xl" />
            <h1 className="m-0 text-3xl font-bold">Mi Biblioteca</h1>
          </div>
          <p className="m-0">Registra, consulta, edita y elimina los libros de tu colección.</p>
        </div>
      </header>

      <main className="contenedor py-4">
        <div className="grid mb-2">
          {[
            ['Libros', libros.length, 'pi-book'],
            ['Leídos', leidos, 'pi-check-circle'],
            ['Pendientes', libros.length - leidos, 'pi-clock']
          ].map(([titulo, valor, icono]) => (
            <div key={titulo} className="col-4">
              <div className="stat p-3 flex flex-column md:flex-row md:align-items-center gap-2">
                <i className={`pi ${icono} text-xl text-primary`} />
                <div>
                  <div className="text-2xl font-bold">{valor}</div>
                  <div className="text-sm text-600">{titulo}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="panel">
          <div className="flex flex-column md:flex-row gap-2 justify-content-between p-3">
            <IconField iconPosition="left" className="w-full md:w-20rem">
              <InputIcon className="pi pi-search" />
              <InputText value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por título, autor…" className="w-full" aria-label="Buscar" />
            </IconField>
            <Button label="Agregar libro" icon="pi pi-plus" onClick={() => setForm({ ...VACIO })} />
          </div>

          <DataTable
            value={libros}
            loading={cargando}
            globalFilter={busqueda}
            globalFilterFields={['titulo', 'autor', 'genero']}
            paginator
            rows={8}
            dataKey="id"
            emptyMessage="No hay libros registrados"
          >
            <Column
              field="titulo"
              header="Título"
              sortable
              body={(l) => (
                <>
                  <div className="font-semibold">{l.titulo}</div>
                  <div className="text-sm text-600 sm:hidden">{l.autor}</div>
                </>
              )}
            />
            <Column field="autor" header="Autor" sortable headerClassName="desde-sm" bodyClassName="desde-sm" />
            <Column field="genero" header="Género" sortable headerClassName="desde-md" bodyClassName="desde-md" />
            <Column field="anio" header="Año" sortable headerClassName="desde-md" bodyClassName="desde-md" />
            <Column header="Estado" body={estado} />
            <Column body={acciones} />
          </DataTable>
        </section>
      </main>

      {/* Consulta individual */}
      <Dialog header="Detalle del libro" visible={!!detalle} onHide={() => setDetalle(null)} style={{ width: '28rem' }} breakpoints={{ '640px': '95vw' }}>
        {detalle && (
          <dl className="detalle m-0">
            <dt>Título</dt>
            <dd className="text-xl">{detalle.titulo}</dd>
            <dt>Autor</dt>
            <dd>{detalle.autor}</dd>
            <div className="grid">
              <div className="col-6">
                <dt>Género</dt>
                <dd>{detalle.genero || '—'}</dd>
              </div>
              <div className="col-6">
                <dt>Año</dt>
                <dd>{detalle.anio || '—'}</dd>
              </div>
            </div>
            <dt>Estado</dt>
            <dd>{estado(detalle)}</dd>
            <dt>Registrado</dt>
            <dd>{new Date(detalle.creado_en).toLocaleString('es-MX')}</dd>
            <div className="flex gap-2 justify-content-end">
              <Button label="Editar" icon="pi pi-pencil" outlined onClick={() => { setForm({ ...detalle }); setDetalle(null) }} />
              <Button label="Eliminar" icon="pi pi-trash" severity="danger" outlined onClick={() => eliminar(detalle)} />
            </div>
          </dl>
        )}
      </Dialog>

      {/* Agregar / editar */}
      <Dialog header={form?.id ? 'Editar libro' : 'Nuevo libro'} visible={!!form} onHide={() => setForm(null)} style={{ width: '32rem' }} breakpoints={{ '640px': '95vw' }}>
        {form && (
          <form onSubmit={guardar} className="flex flex-column gap-3">
            <div className="flex flex-column gap-1">
              <label htmlFor="titulo">Título *</label>
              <InputText id="titulo" value={form.titulo} onChange={(e) => campo('titulo', e.target.value)} required autoFocus />
            </div>
            <div className="flex flex-column gap-1">
              <label htmlFor="autor">Autor *</label>
              <InputText id="autor" value={form.autor} onChange={(e) => campo('autor', e.target.value)} required />
            </div>
            <div className="grid">
              <div className="col-12 md:col-7 flex flex-column gap-1">
                <label htmlFor="genero">Género</label>
                <Dropdown inputId="genero" value={form.genero} options={GENEROS} onChange={(e) => campo('genero', e.value)} placeholder="Selecciona" showClear />
              </div>
              <div className="col-12 md:col-5 flex flex-column gap-1">
                <label htmlFor="anio">Año</label>
                <InputNumber inputId="anio" value={form.anio} onValueChange={(e) => campo('anio', e.value)} useGrouping={false} min={0} max={2100} className="w-full" inputClassName="w-full" />
              </div>
            </div>
            <div className="flex align-items-center gap-2">
              <Checkbox inputId="leido" checked={form.leido} onChange={(e) => campo('leido', e.checked)} />
              <label htmlFor="leido">Ya lo leí</label>
            </div>
            <div className="flex gap-2 justify-content-end">
              <Button type="button" label="Cancelar" text onClick={() => setForm(null)} />
              <Button type="submit" label="Guardar" icon="pi pi-check" loading={guardando} />
            </div>
          </form>
        )}
      </Dialog>
    </>
  )
}
