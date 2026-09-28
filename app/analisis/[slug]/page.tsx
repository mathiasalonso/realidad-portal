import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api, fecha } from '@/lib/api';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';
import { Bloques, Objeciones } from '@/components/Bloques';
import { ProgresoLectura } from '@/components/ProgresoLectura';
import { EtiquetaTema, TarjetaAnalisis } from '@/components/TarjetaAnalisis';

export const revalidate = 60;

/// Next pide los params como promesa en el App Router.
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const analisis = await api.unAnalisis(slug);
  if (!analisis) return { title: 'Análisis no encontrado' };

  return {
    title: analisis.titulo,
    description: analisis.bajada,
    openGraph: {
      title: analisis.titulo,
      description: analisis.bajada,
      type: 'article',
      publishedTime: analisis.publicadoEn ?? undefined,
      authors: [analisis.autor.nombre],
    },
  };
}

export default async function PaginaAnalisis({ params }: Props) {
  const { slug } = await params;
  const [analisis, temas] = await Promise.all([api.unAnalisis(slug), api.temas()]);

  // Un borrador devuelve 404 desde el backend, así que acá llega como null.
  if (!analisis) notFound();

  const relacionados = ((await api.analisis()) ?? [])
    .filter((a) => a.slug !== analisis.slug)
    .slice(0, 3);

  const iniciales = analisis.autor.nombre.split(' ').map((p) => p[0]).slice(0, 2).join('');

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecera />
      <ProgresoLectura slug={analisis.slug} />

      <section className="border-b border-[#E8EEF5] bg-surface px-6 pt-12 pb-14 md:px-[130px]">
        <nav className="mb-7 flex items-center gap-2.5 text-[13.5px] text-muted">
          <Link href="/" className="hover:text-brand-action">Inicio</Link>
          <span className="text-[#B6C2CE]">/</span>
          <Link href={`/temas/${analisis.tema.slug}`} className="hover:text-brand-action">
            {analisis.tema.nombre}
          </Link>
        </nav>

        <div className="flex max-w-[900px] flex-col items-start gap-6">
          <EtiquetaTema nombre={analisis.tema.nombre} color={analisis.tema.color} />
          <h1 className="font-display text-[36px] font-extrabold leading-[1.07] tracking-[-0.035em] md:text-[56px]">
            {analisis.titulo}
          </h1>
          <p className="max-w-[780px] text-[21px] leading-[1.68] text-body">{analisis.bajada}</p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-t border-line-soft pt-7">
          <div className="flex items-center gap-3.5">
            <span className="flex size-[46px] items-center justify-center rounded-[14px] bg-brand-tint font-display text-[15px] font-bold text-brand-dark">
              {iniciales}
            </span>
            <span className="flex flex-col leading-snug">
              <span className="font-display text-[15.5px] font-bold">{analisis.autor.nombre}</span>
              <span className="text-[13.5px] text-muted">
                {fecha(analisis.publicadoEn)} · {analisis.minutosLectura} min de lectura
              </span>
            </span>
          </div>
          <span className="inline-flex items-center gap-2.5 rounded-xl bg-teal-tint px-4 py-2.5 font-display text-[13.5px] font-semibold text-teal-ink">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4,13 9,18 20,6" />
            </svg>
            Cada dato enlaza a su fuente original
          </span>
        </div>
      </section>

      <main className="px-6 py-16 md:px-[130px]">
        <article className="max-w-[860px]">
          <Bloques bloques={analisis.bloques} />
          <Objeciones objeciones={analisis.objeciones} />

          {analisis.cambios.length > 0 && (
            <section className="mt-14 rounded-3xl border border-[#E8EEF5] bg-surface p-8">
              <span className="font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-muted">
                Registro de cambios
              </span>
              <div className="mt-5 flex flex-col gap-4">
                {analisis.cambios.map((cambio, i) => (
                  <div key={i} className="flex gap-3.5">
                    <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${i === 0 ? 'bg-brand' : 'bg-[#D5DFE9]'}`} />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[13.5px] font-bold">{fecha(cambio.creadoEn)}</span>
                      <span className="text-[13px] leading-relaxed text-muted">
                        {cambio.nota ?? cambio.estadoHasta ?? ''}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {analisis.autor.bio && (
            <section className="mt-12 flex flex-wrap items-center gap-4 border-t border-line pt-8">
              <span className="flex size-12 items-center justify-center rounded-[15px] bg-brand-tint font-display text-[15px] font-bold text-brand-dark">
                {iniciales}
              </span>
              <span className="flex max-w-[600px] flex-col gap-1">
                <span className="font-display text-base font-bold">{analisis.autor.nombre}</span>
                <span className="text-sm leading-relaxed text-muted">{analisis.autor.bio}</span>
              </span>
            </section>
          )}
        </article>
      </main>

      {relacionados.length > 0 && (
        <section className="px-6 pb-16 md:px-[130px]">
          <h2 className="mb-8 font-display text-[30px] font-extrabold tracking-[-0.028em]">
            Si te interesó esto, seguí por acá
          </h2>
          <div className="grid gap-7 md:grid-cols-3">
            {relacionados.map((a) => <TarjetaAnalisis key={a.slug} analisis={a} />)}
          </div>
        </section>
      )}

      <PiePagina temas={temas ?? []} />
    </div>
  );
}
