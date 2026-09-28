import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Cabecera } from '@/components/Cabecera';
import { PiePagina } from '@/components/PiePagina';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Método',
  description: 'Cómo trabajamos cada tema en la cátedra de Realidad Nacional.',
};

const PASOS = [
  ['Una pregunta discutible', 'No arrancamos de un titular sino de una pregunta que admita más de una respuesta razonable. Si la respuesta es obvia antes de mirar los datos, el tema no sirve.'],
  ['La fuente, abierta', 'Cada gráfico enlaza al dataset original publicado por la institución y a la versión exacta que usamos. Cualquiera puede bajar el archivo y rehacer el cálculo.'],
  ['El desacuerdo, a la vista', 'Las objeciones que surgen en clase se publican junto al texto, con su estado. Si una se resuelve con datos, el análisis se corrige y queda constancia.'],
];

export default async function PaginaMetodo() {
  const temas = await api.temas();

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecera />

      <section className="px-6 pt-14 pb-10 md:px-[130px]">
        <h1 className="max-w-[900px] font-display text-[44px] font-extrabold leading-[1.08] tracking-[-0.035em]">
          Cómo trabajamos cada tema
        </h1>
        <p className="mt-5 max-w-[740px] text-[19px] leading-[1.75] text-body">
          Este portal existe porque las conclusiones de la materia se quedaban en el aula.
          Publicamos el recorrido completo, no solo el resultado.
        </p>
      </section>

      <section className="grid gap-6 px-6 pb-14 md:grid-cols-3 md:px-[130px]">
        {PASOS.map(([titulo, detalle], i) => (
          <div key={titulo} className="flex flex-col gap-4 rounded-3xl border border-[#E8EEF5] bg-surface p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand font-display text-base font-extrabold text-white">
              {i + 1}
            </span>
            <span className="font-display text-[20px] font-bold tracking-[-0.02em]">{titulo}</span>
            <span className="text-[15.5px] leading-[1.7] text-body">{detalle}</span>
          </div>
        ))}
      </section>

      <section className="mx-6 mb-16 rounded-[30px] bg-deep px-8 py-12 text-white md:mx-[130px] md:px-14">
        <h2 className="max-w-[760px] font-display text-[30px] font-extrabold leading-[1.2] tracking-[-0.028em]">
          Qué medimos y qué no
        </h2>
        <div className="mt-6 grid max-w-[900px] gap-5 text-[16px] leading-[1.75] text-[#B9CCE0] md:grid-cols-2">
          <p>
            Medimos cuántas personas leen, cuánto tiempo y hasta dónde llegan, con un contador
            propio en nuestro servidor. Nos sirve para saber si un tema se entendió.
          </p>
          <p>
            No usamos Google Analytics ni rastreadores de terceros, no guardamos tu dirección IP
            completa y no hay cookies de seguimiento. Nadie más ve tu visita.
          </p>
        </div>
      </section>

      <PiePagina temas={temas ?? []} />
    </div>
  );
}
