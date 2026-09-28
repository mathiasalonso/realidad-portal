import type { Bloque } from '@/lib/api';
import { fecha } from '@/lib/api';
import { Figura } from './Figura';

function texto(bloque: Bloque, campo = 'texto') {
  const valor = bloque.contenido[campo];
  return typeof valor === 'string' ? valor : '';
}

/// Cada tipo de bloque se renderiza distinto. El backend garantiza que el
/// contenido tenga los campos que cada tipo necesita, así que acá no hace
/// falta defenderse de formas raras.
export function Bloques({ bloques }: { bloques: Bloque[] }) {
  return (
    <>
      {bloques.map((bloque, i) => {
        switch (bloque.tipo) {
          case 'PARRAFO':
            return (
              <p key={i} className="mt-8 max-w-[720px] text-[20px] leading-[1.85] text-[#1F2A35] first:mt-0">
                {texto(bloque)}
              </p>
            );

          case 'SUBTITULO':
            // Un subtítulo cada dos párrafos sube el tiempo de lectura cerca
            // de un 20%: es la pieza que más rinde de toda la nota.
            return (
              <h2
                key={i}
                id={texto(bloque, 'ancla') || undefined}
                className="mt-14 scroll-mt-32 font-display text-[32px] font-extrabold leading-[1.22] tracking-[-0.03em]"
              >
                {texto(bloque)}
              </h2>
            );

          case 'CITA':
            return (
              <blockquote
                key={i}
                className="my-12 max-w-[760px] rounded-r-[20px] border border-[#E8EEF5] border-l-[5px] border-l-brand bg-surface px-10 py-8"
              >
                <p className="font-display text-[26px] font-bold leading-[1.4] tracking-[-0.02em]">
                  {texto(bloque)}
                </p>
              </blockquote>
            );

          case 'FIGURA':
          case 'TABLA':
            return <Figura key={i} bloque={bloque} />;

          case 'IMAGEN':
            return (
              <figure key={i} className="my-9">
                <div className="flex h-64 items-center justify-center rounded-3xl border border-[#E8EEF5] bg-brand-tint text-[13px] text-brand-dark">
                  [imagen: {texto(bloque, 'archivo')}]
                </div>
                {texto(bloque, 'epigrafe') && (
                  <figcaption className="mt-3 text-[13px] text-muted">{texto(bloque, 'epigrafe')}</figcaption>
                )}
              </figure>
            );

          case 'OBJECION':
            return (
              <aside key={i} className="my-9 rounded-3xl border border-[#F3E0CD] bg-[#FFF8F1] p-8">
                <span className="font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-warm-ink">
                  Objeción del aula
                </span>
                <p className="mt-3 text-[18px] leading-[1.8] text-[#33291F]">{texto(bloque)}</p>
                <span className="mt-3 block text-[13.5px] text-[#7A6551]">
                  {texto(bloque, 'planteadaPor')}
                </span>
              </aside>
            );

          case 'INDICADOR':
            return (
              <div key={i} className="my-8 inline-flex flex-col gap-2 rounded-2xl border border-[#E8EEF5] bg-surface px-7 py-5">
                <span className="font-label text-[11px] font-bold uppercase tracking-[0.11em] text-muted">
                  {texto(bloque, 'etiqueta') || 'Indicador'}
                </span>
                <span className="font-display text-[30px] font-extrabold tracking-[-0.03em]">
                  {texto(bloque, 'valor') || '[valor]'}
                </span>
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

/// Las objeciones que están en la tabla `Objecion`, no como bloque dentro del
/// texto. Se publican junto a la nota con su estado a la vista.
export function Objeciones({
  objeciones,
}: {
  objeciones: { texto: string; planteadaPor: string; planteadaEn: string; estado: string; resolucion: string | null }[];
}) {
  if (!objeciones.length) return null;

  return (
    <section className="mt-14">
      <h2 className="font-display text-[32px] font-extrabold leading-[1.22] tracking-[-0.03em]">
        Objeciones del aula
      </h2>
      <p className="mt-5 max-w-[720px] text-[20px] leading-[1.85] text-[#1F2A35]">
        Las publicamos junto al texto porque forman parte del razonamiento. Si alguien
        las resuelve con datos, el análisis se corrige y queda constancia del cambio.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        {objeciones.map((objecion, i) => {
          const pendiente = objecion.estado === 'PENDIENTE';
          return (
            <div key={i} className="rounded-3xl border border-[#F3E0CD] bg-[#FFF8F1] p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="flex flex-col">
                  <span className="font-display text-[15px] font-bold">{objecion.planteadaPor}</span>
                  <span className="text-[13.5px] text-[#7A6551]">{fecha(objecion.planteadaEn)}</span>
                </span>
                <span className={`rounded-full px-4 py-2 font-display text-[12.5px] font-bold ${pendiente ? 'bg-[#F3E0CD] text-warm-ink' : 'bg-teal-tint text-teal-ink'}`}>
                  {pendiente ? 'Pendiente' : 'Resuelta'}
                </span>
              </div>
              <p className="mt-5 text-[18px] leading-[1.8] text-[#33291F]">{objecion.texto}</p>
              {objecion.resolucion && (
                <p className="mt-4 border-t border-[#F3E0CD] pt-4 text-[15px] leading-relaxed text-[#5C4A38]">
                  <strong className="font-semibold">Resolución:</strong> {objecion.resolucion}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
