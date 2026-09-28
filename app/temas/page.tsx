import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';

export const revalidate = 300;
export const metadata: Metadata = {
  title: 'Temas',
  description: 'Los temas que sigue el observatorio de la cátedra de Realidad Nacional.',
};

export default async function PaginaTemas() {
  const [temas, analisis] = await Promise.all([api.temas(), api.analisis()]);
  const lista = temas ?? [];
  const cuantos = (slug: string) => (analisis ?? []).filter((a) => a.tema.slug === slug).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecera />
      <section className="px-6 pt-14 pb-10 md:px-[130px]">
        <h1 className="font-display text-[44px] font-extrabold tracking-[-0.035em]">Temas</h1>
        <p className="mt-4 max-w-[680px] text-[18px] leading-relaxed text-body">
          Cada tema agrupa los análisis y los datasets que lo sostienen.
        </p>
      </section>
      <section className="grid gap-6 px-6 pb-16 md:grid-cols-3 md:px-[130px]">
        {lista.map((tema) => (
          <Link
            key={tema.slug}
            href={`/temas/${tema.slug}`}
            className="flex flex-col gap-3 rounded-3xl border border-[#E8EEF5] bg-surface p-8 shadow-[0_6px_22px_rgba(15,23,32,0.05)] hover:border-brand"
          >
            <span className="size-3 rounded-full" style={{ backgroundColor: tema.color }} />
            <span className="font-display text-[24px] font-bold tracking-[-0.02em]">{tema.nombre}</span>
            <span className="text-[14.5px] text-muted">
              {cuantos(tema.slug)} {cuantos(tema.slug) === 1 ? 'análisis' : 'análisis'}
            </span>
          </Link>
        ))}
      </section>
      <PiePagina temas={lista} />
    </div>
  );
}
