import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { api, fecha } from '@/lib/api';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';
import { DescargarDataset } from '@/components/DescargarDataset';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dataset = await api.unDataset(slug);
  return {
    title: dataset ? dataset.titulo : 'Dataset',
    description: dataset?.descripcion ?? undefined,
  };
}

export default async function PaginaDataset({ params }: Props) {
  const { slug } = await params;
  const [dataset, temas] = await Promise.all([api.unDataset(slug), api.temas()]);
  if (!dataset) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecera />

      <section className="border-b border-[#E8EEF5] bg-surface px-6 pt-14 pb-12 md:px-[130px]">
        <nav className="mb-6 flex items-center gap-2.5 text-[13.5px] text-muted">
          <Link href="/" className="hover:text-brand-action">Inicio</Link>
          <span className="text-[#B6C2CE]">/</span>
          <Link href="/datos" className="hover:text-brand-action">Datos</Link>
        </nav>
        <span className="font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-brand-dark">
          {dataset.institucion}
        </span>
        <h1 className="mt-3 max-w-[900px] font-display text-[38px] font-extrabold leading-[1.1] tracking-[-0.032em]">
          {dataset.titulo}
        </h1>
        {dataset.descripcion && (
          <p className="mt-4 max-w-[740px] text-[18px] leading-[1.7] text-body">{dataset.descripcion}</p>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-6 text-[15px] text-muted">
          <span>
            Período: {dataset.periodoDesde}
            {dataset.periodoHasta && dataset.periodoHasta !== dataset.periodoDesde ? `–${dataset.periodoHasta}` : ''}
          </span>
          <a href={dataset.urlFuente} target="_blank" rel="noopener noreferrer" className="font-display font-semibold text-brand-action hover:text-brand-dark">
            Ver la publicación oficial
          </a>
        </div>
      </section>

      <section className="px-6 py-14 md:px-[130px]">
        <h2 className="font-display text-[28px] font-extrabold tracking-[-0.025em]">Versiones</h2>
        <p className="mt-3 max-w-[740px] text-[16.5px] leading-[1.7] text-body">
          Cada corrección de la institución entra como una versión nueva. Los gráficos ya
          publicados siguen apuntando a la versión con la que se hizo el cálculo: por eso un
          análisis viejo se puede reproducir aunque la fuente haya cambiado después.
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {dataset.versiones.map((version) => (
            <div key={version.id} className="rounded-3xl border border-[#E8EEF5] bg-surface p-8 shadow-[0_6px_22px_rgba(15,23,32,0.05)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="font-display text-[19px] font-bold">{version.etiqueta}</span>
                  {version.esVigente && (
                    <span className="rounded-full bg-teal-tint px-3 py-1 font-display text-[12px] font-bold text-teal-ink">
                      Vigente
                    </span>
                  )}
                </span>
                <DescargarDataset archivo={version.archivo} datasetVersionId={version.id} />
              </div>

              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-muted">
                <span>Obtenida el {fecha(version.obtenidaEn)}</span>
                {version.publicadaEn && <span>Publicada por la institución el {fecha(version.publicadaEn)}</span>}
                {version.checksum && <span className="font-mono text-[12px]">SHA-256 {version.checksum.slice(0, 16)}…</span>}
              </div>

              {version.notas && <p className="mt-4 text-[15px] leading-relaxed text-body">{version.notas}</p>}

              <div className="mt-6 border-t border-line-soft pt-5">
                <span className="font-label text-[11px] font-bold uppercase tracking-[0.11em] text-muted">
                  Análisis que usan esta versión
                </span>
                {version.bloques.length === 0 ? (
                  <p className="mt-3 text-[14.5px] text-faint">Ninguno todavía.</p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-2">
                    {version.bloques.map((b, i) => (
                      <li key={i}>
                        <Link href={`/analisis/${b.analisis.slug}`} className="font-display text-[15.5px] font-semibold text-brand-action hover:text-brand-dark">
                          {b.analisis.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <PiePagina temas={temas ?? []} />
    </div>
  );
}
