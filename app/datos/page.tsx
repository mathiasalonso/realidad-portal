import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';

export const revalidate = 300;
export const metadata: Metadata = {
  title: 'Datos',
  description: 'Todos los datasets que usamos, con su fuente original y descargables.',
};

export default async function PaginaDatos() {
  const [datasets, temas] = await Promise.all([api.datasets(), api.temas()]);
  const lista = datasets ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecera />

      <section className="px-6 pt-14 pb-10 md:px-[130px]">
        <h1 className="font-display text-[44px] font-extrabold tracking-[-0.035em]">
          Los datos, sin intermediarios
        </h1>
        <p className="mt-4 max-w-[720px] text-[18px] leading-[1.7] text-body">
          Todo lo que usamos para escribir, con su institución, su período y su versión.
          Si corregís nuestro cálculo con estos mismos archivos, queremos saberlo.
        </p>
      </section>

      <section className="px-6 pb-16 md:px-[130px]">
        <div className="overflow-hidden rounded-[26px] border border-[#E8EEF5] bg-surface shadow-[0_6px_22px_rgba(15,23,32,0.05)]">
          <div className="hidden grid-cols-[2.6fr_1.2fr_1fr_1fr] gap-4 border-b border-[#E8EEF5] px-9 py-4 font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-muted md:grid">
            <span>Dataset</span><span>Institución</span><span>Período</span><span>Versión vigente</span>
          </div>
          {lista.length === 0 && (
            <p className="px-9 py-12 text-center text-[16px] text-body">
              Todavía no hay datasets cargados.
            </p>
          )}
          {lista.map((dataset) => (
            <Link
              key={dataset.slug}
              href={`/datos/${dataset.slug}`}
              className="grid gap-2 border-b border-line-soft px-9 py-6 last:border-b-0 hover:bg-page md:grid-cols-[2.6fr_1.2fr_1fr_1fr] md:items-center md:gap-4"
            >
              <span className="font-display text-[16px] font-semibold text-ink">{dataset.titulo}</span>
              <span className="text-[15px] text-body">{dataset.institucion}</span>
              <span className="text-[15px] text-body">
                {dataset.periodoDesde}{dataset.periodoHasta && dataset.periodoHasta !== dataset.periodoDesde ? `–${dataset.periodoHasta}` : ''}
              </span>
              <span className="text-[14px] text-muted">
                {dataset.versiones[0]?.etiqueta ?? '—'}
                {dataset._count.versiones > 1 && (
                  <span className="ml-2 rounded-md bg-page px-2 py-0.5 text-[12px]">
                    {dataset._count.versiones} versiones
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <PiePagina temas={temas ?? []} />
    </div>
  );
}
