/// Cliente del backend para el portal.
///
/// Todo lo que se pide acá es contenido público: el backend no devuelve
/// borradores por estas rutas, así que no hace falta pasar credenciales.

const BASE = process.env.BACKEND_URL ?? 'http://localhost:4000';

export type Tema = {
  slug: string;
  nombre: string;
  descripcion: string | null;
  color: string;
};

export type AnalisisEnLista = {
  slug: string;
  titulo: string;
  bajada: string;
  publicadoEn: string | null;
  minutosLectura: number;
  tema: { slug: string; nombre: string; color: string };
  autor: { nombre: string };
};

export type TipoBloque =
  | 'PARRAFO' | 'SUBTITULO' | 'CITA' | 'FIGURA'
  | 'TABLA' | 'IMAGEN' | 'OBJECION' | 'INDICADOR';

export type Bloque = {
  tipo: TipoBloque;
  contenido: Record<string, unknown>;
  datasetVersion: {
    etiqueta: string;
    archivo: string;
    dataset: { slug: string; titulo: string; institucion: string; urlFuente: string };
  } | null;
};

export type Objecion = {
  texto: string;
  planteadaPor: string;
  planteadaEn: string;
  estado: 'PENDIENTE' | 'RESUELTA' | 'RETIRADA';
  resolucion: string | null;
};

export type Analisis = AnalisisEnLista & {
  autor: { nombre: string; bio: string | null };
  bloques: Bloque[];
  objeciones: Objecion[];
  cambios: { estadoHasta: string | null; nota: string | null; creadoEn: string }[];
};

export type Indicador = {
  slug: string;
  etiqueta: string;
  valor: string | null;
  unidad: string | null;
  nota: string | null;
  datasetVersion: {
    etiqueta: string;
    dataset: { slug: string; titulo: string; institucion: string };
  } | null;
};

export type DatasetEnLista = {
  slug: string;
  titulo: string;
  institucion: string;
  descripcion: string | null;
  periodoDesde: string | null;
  periodoHasta: string | null;
  urlFuente: string;
  versiones: { etiqueta: string; archivo: string; obtenidaEn: string }[];
  _count: { versiones: number };
};

export type Dataset = Omit<DatasetEnLista, 'versiones' | '_count'> & {
  versiones: {
    id: string;
    etiqueta: string;
    archivo: string;
    checksum: string | null;
    publicadaEn: string | null;
    obtenidaEn: string;
    notas: string | null;
    esVigente: boolean;
    bloques: { analisis: { slug: string; titulo: string; publicadoEn: string | null } }[];
  }[];
};

/// `revalidate: 60` mantiene el portal rápido sin dejarlo desactualizado:
/// una nota recién publicada aparece en un minuto como máximo.
async function pedir<T>(ruta: string, revalidate = 60): Promise<T> {
  const respuesta = await fetch(`${BASE}${ruta}`, { next: { revalidate } });
  if (!respuesta.ok) {
    throw new Error(`El backend respondió ${respuesta.status} en ${ruta}`);
  }
  return respuesta.json() as Promise<T>;
}

/// Igual que `pedir`, pero devuelve null en lugar de fallar. Se usa donde el
/// portal tiene que seguir funcionando aunque el backend esté caído: es
/// preferible una portada sin la franja de indicadores que una pantalla de error.
async function pedirONull<T>(ruta: string, revalidate = 60): Promise<T | null> {
  try {
    return await pedir<T>(ruta, revalidate);
  } catch {
    return null;
  }
}

export const api = {
  temas: () => pedirONull<Tema[]>('/temas', 300),
  analisis: (tema?: string) =>
    pedirONull<AnalisisEnLista[]>(`/analisis${tema ? `?tema=${encodeURIComponent(tema)}` : ''}`),
  unAnalisis: (slug: string) => pedirONull<Analisis>(`/analisis/${encodeURIComponent(slug)}`),
  indicadores: () => pedirONull<Indicador[]>('/indicadores', 300),
  datasets: () => pedirONull<DatasetEnLista[]>('/datos', 300),
  unDataset: (slug: string) => pedirONull<Dataset>(`/datos/${encodeURIComponent(slug)}`, 300),
};

/// Fecha en el formato que se lee en el portal: "18 sep 2026".
export function fecha(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-PY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
