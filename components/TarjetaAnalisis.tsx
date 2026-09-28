import Link from 'next/link';
import { fecha, type AnalisisEnLista } from '@/lib/api';

/// Los tres colores de tema son los validados de la paleta de gráficos.
/// Para el texto de la etiqueta se usa una versión más oscura, porque el color
/// de la marca no alcanza el contraste mínimo en texto chico.
const TINTE: Record<string, { fondo: string; texto: string }> = {
  '#357CBD': { fondo: 'bg-brand-tint', texto: 'text-brand-dark' },
  '#D2691E': { fondo: 'bg-warm-tint', texto: 'text-warm-ink' },
  '#0F9B8E': { fondo: 'bg-teal-tint', texto: 'text-teal-ink' },
};

export function EtiquetaTema({ nombre, color }: { nombre: string; color: string }) {
  const tinte = TINTE[color.toUpperCase()] ?? TINTE['#357CBD'];
  return (
    <span className={`rounded-[9px] px-3 py-1.5 font-label text-[11.5px] font-bold uppercase tracking-[0.09em] ${tinte.fondo} ${tinte.texto}`}>
      {nombre}
    </span>
  );
}

export function TarjetaAnalisis({
  analisis,
  destacada = false,
}: {
  analisis: AnalisisEnLista;
  destacada?: boolean;
}) {
  return (
    <Link
      href={`/analisis/${analisis.slug}`}
      className="flex flex-col gap-4 rounded-3xl border border-[#E8EEF5] bg-surface p-9 text-ink shadow-[0_6px_22px_rgba(15,23,32,0.05)] transition hover:border-[#C9DCEE] hover:shadow-[0_10px_30px_rgba(15,23,32,0.09)]"
    >
      <div className="flex flex-wrap items-center gap-3">
        <EtiquetaTema nombre={analisis.tema.nombre} color={analisis.tema.color} />
        <span className="text-[13.5px] text-muted">
          {fecha(analisis.publicadoEn)} · {analisis.minutosLectura} min
        </span>
      </div>
      <h3 className={`font-display font-bold leading-[1.22] tracking-[-0.022em] ${destacada ? 'text-[33px]' : 'text-[25px]'}`}>
        {analisis.titulo}
      </h3>
      <p className="text-base leading-[1.68] text-body">{analisis.bajada}</p>
    </Link>
  );
}
