import type { Bloque } from '@/lib/api';
import { DescargarDataset } from './DescargarDataset';

/// Los gráficos se dibujan con la forma de la serie, no con valores inventados.
/// Cuando el panel permita cargar los puntos, este componente recibe los datos
/// y reemplaza la forma de muestra; el marco, la fuente y las acciones no cambian.
const COLOR = { serie1: '#357CBD', serie2: '#D2691E', serie3: '#0F9B8E' };

function Lineas() {
  return (
    <svg viewBox="0 0 660 262" role="img" aria-label="Gráfico de líneas, forma de la serie" className="w-full">
      <line x1="44" y1="20" x2="560" y2="20" stroke="#EFF3F8" strokeWidth="1" />
      <line x1="44" y1="76" x2="560" y2="76" stroke="#EFF3F8" strokeWidth="1" />
      <line x1="44" y1="132" x2="560" y2="132" stroke="#EFF3F8" strokeWidth="1" />
      <line x1="44" y1="188" x2="560" y2="188" stroke="#EFF3F8" strokeWidth="1" />
      <line x1="44" y1="220" x2="560" y2="220" stroke="#DCE5EE" strokeWidth="1" />
      <text x="0" y="24" fontSize="11" fill="#8896A3">alto</text>
      <text x="0" y="136" fontSize="11" fill="#8896A3">medio</text>
      <text x="0" y="224" fontSize="11" fill="#8896A3">bajo</text>
      <path d="M 60 104 L 160 112 L 260 128 L 360 150 L 460 172 L 556 192 L 556 220 L 60 220 Z" fill={COLOR.serie1} fillOpacity="0.09" />
      <polyline points="60,62 160,58 260,64 360,60 460,66 556,64" fill="none" stroke={COLOR.serie2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="60,104 160,112 260,128 360,150 460,172 556,192" fill="none" stroke={COLOR.serie1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="556" cy="64" r="5" fill={COLOR.serie2} stroke="#fff" strokeWidth="2" />
      <circle cx="556" cy="192" r="5" fill={COLOR.serie1} stroke="#fff" strokeWidth="2" />
      <text x="574" y="60" fontSize="11.5" fontWeight="600" fill="#33404D">serie 2</text>
      <text x="574" y="74" fontSize="11" fill="#64727F">[valor]</text>
      <text x="574" y="188" fontSize="11.5" fontWeight="600" fill="#33404D">serie 1</text>
      <text x="574" y="202" fontSize="11" fill="#64727F">[valor]</text>
      <text x="60" y="244" fontSize="11" fill="#64727F" textAnchor="middle">inicio</text>
      <text x="556" y="244" fontSize="11" fill="#64727F" textAnchor="middle">fin</text>
    </svg>
  );
}

function BarrasHorizontales() {
  const filas = [
    { etiqueta: 'Criterio A', ancho: 470, color: COLOR.serie1, y: 10 },
    { etiqueta: 'Criterio B', ancho: 300, color: COLOR.serie2, y: 76 },
    { etiqueta: 'Criterio C', ancho: 382, color: COLOR.serie3, y: 142 },
  ];
  return (
    <svg viewBox="0 0 660 212" role="img" aria-label="Gráfico de barras horizontales, forma de la serie" className="w-full">
      <line x1="104" y1="4" x2="104" y2="180" stroke="#DCE5EE" strokeWidth="1" />
      {filas.map((f) => (
        <g key={f.etiqueta}>
          <text x="0" y={f.y + 18} fontSize="13" fontWeight="600" fill="#33404D">{f.etiqueta}</text>
          <rect x="104" y={f.y} width={f.ancho} height="26" rx="4" fill={f.color} />
          <rect x="104" y={f.y} width="6" height="26" fill={f.color} />
          <text x={104 + f.ancho + 14} y={f.y + 18} fontSize="12.5" fill="#64727F">[valor]</text>
        </g>
      ))}
      <text x="104" y="202" fontSize="11.5" fill="#8896A3">0</text>
      <text x="470" y="202" fontSize="11.5" fill="#8896A3">total</text>
    </svg>
  );
}

function Barras() {
  const alturas = [62, 84, 106, 94, 124, 142, 164];
  return (
    <svg viewBox="0 0 660 252" role="img" aria-label="Gráfico de barras, forma de la serie" className="w-full">
      {[20, 68, 116, 164].map((y) => (
        <line key={y} x1="44" y1={y} x2="640" y2={y} stroke="#EFF3F8" strokeWidth="1" />
      ))}
      <line x1="44" y1="212" x2="640" y2="212" stroke="#DCE5EE" strokeWidth="1" />
      {alturas.map((h, i) => (
        <g key={i} fill={COLOR.serie1}>
          <rect x={60 + i * 84} y={212 - h} width="56" height={h} rx="4" />
          <rect x={60 + i * 84} y={206} width="56" height="6" />
        </g>
      ))}
      <text x="88" y="234" fontSize="11" fill="#64727F" textAnchor="middle">inicio</text>
      <text x="592" y="234" fontSize="11" fill="#64727F" textAnchor="middle">fin</text>
    </svg>
  );
}

export function Figura({ bloque }: { bloque: Bloque }) {
  const titulo = String(bloque.contenido.titulo ?? 'Figura');
  const nota = bloque.contenido.nota ? String(bloque.contenido.nota) : null;
  const tipo = String(bloque.contenido.tipoGrafico ?? 'lineas');
  const version = bloque.datasetVersion;

  return (
    <figure className="my-9 rounded-3xl border border-[#E8EEF5] bg-surface p-8 shadow-[0_6px_22px_rgba(15,23,32,0.05)]">
      <figcaption className="font-display text-[19px] font-bold">{titulo}</figcaption>
      <p className="mt-1.5 text-[13px] text-muted">
        {nota ?? 'Vista previa con la forma de la serie'}
        {version && ` · ${version.dataset.institucion} ${version.etiqueta}`}
      </p>

      <div className="mt-6">
        {tipo === 'barras-horizontales' ? <BarrasHorizontales />
          : tipo === 'barras' ? <Barras />
          : <Lineas />}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-line-soft pt-4 text-[12px] text-muted md:flex-row md:items-center md:justify-between">
        {version ? (
          <span>
            Fuente:{' '}
            <a href={version.dataset.urlFuente} target="_blank" rel="noopener noreferrer" className="text-brand-action hover:text-brand-dark">
              {version.dataset.titulo}
            </a>{' '}
            ({version.dataset.institucion}), versión {version.etiqueta}
          </span>
        ) : (
          <span>Sin dataset vinculado</span>
        )}

        {version && (
          <span className="flex shrink-0 gap-5">
            <a href={`/datos/${version.dataset.slug}`} className="font-display text-[12.5px] font-semibold text-brand-action hover:text-brand-dark">
              Ver tabla
            </a>
            <DescargarDataset archivo={version.archivo} />
          </span>
        )}
      </div>
    </figure>
  );
}
