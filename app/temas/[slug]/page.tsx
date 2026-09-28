import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';
import { TarjetaAnalisis } from '@/components/TarjetaAnalisis';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const temas = (await api.temas()) ?? [];
  const tema = temas.find((t) => t.slug === slug);
  return {
    title: tema ? tema.nombre : 'Tema',
    description: tema?.descripcion ?? `Análisis sobre ${tema?.nombre ?? 'este tema'} en Paraguay.`,
  };
}

export default async function PaginaTema({ params }: Props) {
  const { slug } = await params;
  const temas = (await api.temas()) ?? [];
  const tema = temas.find((t) => t.slug === slug);
  if (!tema) notFound();

  const analisis = (await api.analisis(slug)) ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecera />

      <section className="border-b border-[#E8EEF5] bg-surface px-6 pt-14 pb-12 md:px-[130px]">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-brand-tint px-4 py-2 font-label text-[12px] font-bold uppercase tracking-[0.09em] text-brand-dark">
          <span className="size-[7px] rounded-full" style={{ backgroundColor: tema.color }} />
          Tema
        </span>
        <h1 className="mt-5 font-display text-[44px] font-extrabold leading-[1.08] tracking-[-0.035em] md:text-[56px]">
          {tema.nombre}
        </h1>
        <p className="mt-4 max-w-[740px] text-[19px] leading-[1.7] text-body">
          {tema.descripcion ??
            `Todo lo que publicamos sobre ${tema.nombre.toLowerCase()}, con la fuente de cada dato a la vista.`}
        </p>
        <p className="mt-6 text-[15px] text-muted">
          {analisis.length === 0
            ? 'Todavía no hay análisis publicados en este tema.'
            : `${analisis.length} ${analisis.length === 1 ? 'análisis publicado' : 'análisis publicados'}`}
        </p>
      </section>

      <section className="px-6 py-14 md:px-[130px]">
        {analisis.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2">
            {analisis.map((a) => <TarjetaAnalisis key={a.slug} analisis={a} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="text-[17px] text-body">
              Cuando se publique el primer análisis de este tema, aparece acá.
            </p>
          </div>
        )}
      </section>

      <PiePagina temas={temas} />
    </div>
  );
}
