import Link from 'next/link';
import { api, fecha } from '@/lib/api';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';
import { TarjetaAnalisis } from '@/components/TarjetaAnalisis';

/// La portada se regenera cada minuto: rápida para el lector y nunca más de
/// un minuto desactualizada después de publicar.
export const revalidate = 60;

export default async function Portada() {
  const [analisis, temas, indicadores, datasets] = await Promise.all([
    api.analisis(),
    api.temas(),
    api.indicadores(),
    api.datasets(),
  ]);

  const lista = analisis ?? [];
  const [destacado, ...resto] = lista;

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecera />

      {destacado ? (
        <section className="grid gap-16 px-6 py-16 md:px-[130px] md:py-[92px] lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center">
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-brand-tint px-4 py-2 font-label text-[12.5px] font-bold uppercase tracking-[0.07em] text-brand-dark">
              <span className="size-[7px] rounded-full bg-brand" />
              {destacado.tema.nombre} · {fecha(destacado.publicadoEn)}
            </span>
            <h1 className="font-display text-[42px] font-extrabold leading-[1.05] tracking-[-0.035em] md:text-[62px]">
              {destacado.titulo}
            </h1>
            <p className="text-[20px] leading-[1.7] text-body">{destacado.bajada}</p>
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="flex size-[42px] items-center justify-center rounded-[13px] bg-brand-tint font-display text-sm font-bold text-brand-dark">
                {destacado.autor.nombre.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <span className="font-display text-[15px] font-semibold">{destacado.autor.nombre}</span>
              <span className="size-1 rounded-full bg-[#B6C2CE]" />
              <span className="text-[15px] text-muted">{destacado.minutosLectura} min de lectura</span>
            </div>
            <Link
              href={`/analisis/${destacado.slug}`}
              className="mt-2 inline-flex h-[58px] items-center gap-3 rounded-[15px] bg-brand-action px-8 font-display text-[16.5px] font-bold text-white shadow-[0_10px_24px_rgba(27,107,184,0.24)] hover:bg-brand-dark"
            >
              Leer el análisis
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="18" y2="12" /><polyline points="12,6 18,12 12,18" />
              </svg>
            </Link>
          </div>

          {indicadores && indicadores.length > 0 && (
            <div className="rounded-[26px] border border-[#E8EEF5] bg-surface p-8 shadow-[0_20px_48px_rgba(15,23,32,0.08)]">
              <span className="font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-muted">
                Indicadores en seguimiento
              </span>
              <div className="mt-5 flex flex-col divide-y divide-line-soft">
                {indicadores.map((indicador) => (
                  <div key={indicador.slug} className="flex items-baseline justify-between gap-4 py-4">
                    <span className="flex flex-col gap-1">
                      <span className="text-[14.5px] font-medium text-[#33404D]">{indicador.etiqueta}</span>
                      {indicador.nota && <span className="text-[12px] text-faint">{indicador.nota}</span>}
                    </span>
                    <span className="font-display text-[26px] font-extrabold tracking-[-0.03em]">
                      {indicador.valor ?? '[valor]'}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-line-soft pt-4 text-[12px] text-muted">
                Cada indicador queda vinculado a su dataset desde el panel.
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="px-6 py-24 md:px-[130px]">
          <h1 className="font-display text-[42px] font-extrabold tracking-[-0.03em]">Todavía no hay análisis publicados</h1>
          <p className="mt-4 max-w-[560px] text-[18px] leading-relaxed text-body">
            Cuando se publique el primero desde el panel, aparece acá.
            {!analisis && ' Ahora mismo el portal no logra hablar con el backend: revisá que esté levantado en el puerto 4000.'}
          </p>
        </section>
      )}

      {temas && temas.length > 0 && (
        <section className="px-6 pb-[88px] md:px-[130px]">
          <div className="rounded-[26px] border border-[#E8EEF5] bg-surface p-10 shadow-[0_6px_22px_rgba(15,23,32,0.05)]">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.02em]">¿Por dónde querés empezar?</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {temas.map((tema) => (
                <Link
                  key={tema.slug}
                  href={`/temas/${tema.slug}`}
                  className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line bg-page px-5 font-display text-[15px] font-semibold text-ink hover:border-brand hover:bg-brand-tint"
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: tema.color }} />
                  {tema.nombre}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid gap-8 border-t border-line-soft pt-7 md:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <span className="font-display text-[34px] font-extrabold tracking-[-0.03em]">{lista.length}</span>
                <span className="text-[14.5px] text-muted">análisis publicados</span>
              </div>
              <div className="flex flex-col gap-1.5 md:border-l md:border-line-soft md:pl-9">
                <span className="font-display text-[34px] font-extrabold tracking-[-0.03em]">{datasets?.length ?? 0}</span>
                <span className="text-[14.5px] text-muted">datasets abiertos y descargables</span>
              </div>
              <div className="flex flex-col gap-1.5 md:border-l md:border-line-soft md:pl-9">
                <span className="font-display text-[34px] font-extrabold tracking-[-0.03em]">{temas.length}</span>
                <span className="text-[14.5px] text-muted">temas en seguimiento</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {resto.length > 0 && (
        <section className="px-6 pb-[88px] md:px-[130px]">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <h2 className="font-display text-[36px] font-extrabold tracking-[-0.03em]">Análisis recientes</h2>
              <p className="text-[16.5px] text-muted">
                Cada uno con su fuente, su cálculo y las objeciones que recibió en clase.
              </p>
            </div>
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            {resto.map((a) => <TarjetaAnalisis key={a.slug} analisis={a} />)}
          </div>
        </section>
      )}

      <section id="metodo" className="mx-6 mb-[88px] rounded-[30px] bg-deep px-8 py-14 text-white md:mx-[130px] md:px-[60px]">
        <div className="grid gap-16 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-col gap-5">
            <span className="font-label text-[12px] font-bold uppercase tracking-[0.14em] text-[#7FC4EE]">Cómo trabajamos</span>
            <h2 className="font-display text-[36px] font-extrabold leading-[1.14] tracking-[-0.03em]">
              El mismo recorrido que hacemos en clase, publicado paso a paso
            </h2>
            <Link href="/metodo" className="mt-2 inline-flex h-[52px] w-fit items-center rounded-[14px] bg-white px-6 font-display text-[15.5px] font-bold text-deep hover:bg-[#E8F1FA]">
              Leer la metodología
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['Una pregunta discutible', 'Nada de titulares. Empezamos por algo que admita más de una respuesta razonable.'],
              ['La fuente, abierta', 'Cada gráfico enlaza al dataset original y al cálculo, para que se pueda rehacer.'],
              ['El desacuerdo, a la vista', 'Publicamos también las objeciones que surgieron en el aula, junto al texto.'],
            ].map(([titulo, detalle], i) => (
              <div key={titulo} className="flex flex-col gap-3.5 rounded-[20px] border border-white/10 bg-white/[0.06] p-7">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand font-display text-base font-extrabold">{i + 1}</span>
                <span className="font-display text-[17.5px] font-bold">{titulo}</span>
                <span className="text-[15px] leading-[1.65] text-[#B9CCE0]">{detalle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PiePagina temas={temas ?? []} />
    </div>
  );
}
