import Link from 'next/link';
import type { Tema } from '@/lib/api';

export function PiePagina({ temas }: { temas: Tema[] }) {
  return (
    <footer className="mt-auto bg-footer px-6 pt-14 pb-9 text-[#C7D2DD] md:px-[130px]">
      <div className="grid gap-12 border-b border-[#22303D] pb-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-[11px] bg-brand font-display text-[15px] font-extrabold text-white">
              RN
            </span>
            <span className="font-display text-lg font-bold text-white">Realidad Nacional</span>
          </span>
          <span className="max-w-[340px] text-[14.5px] leading-relaxed text-[#93A3B2]">
            Observatorio de la cátedra de Realidad Nacional. Facultad Politécnica,
            Universidad Nacional de Asunción.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-[#6E8094]">Temas</span>
          {temas.slice(0, 4).map((tema) => (
            <Link key={tema.slug} href={`/temas/${tema.slug}`} className="text-[14.5px] text-[#C7D2DD] hover:text-white">
              {tema.nombre}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-[#6E8094]">El proyecto</span>
          <Link href="/metodo" className="text-[14.5px] text-[#C7D2DD] hover:text-white">Metodología</Link>
          <Link href="/datos" className="text-[14.5px] text-[#C7D2DD] hover:text-white">Datasets</Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="font-label text-[11.5px] font-bold uppercase tracking-[0.11em] text-[#6E8094]">Contacto</span>
          <a href="mailto:catedra@realidadnacional.py" className="text-[14.5px] text-[#C7D2DD] hover:text-white">Escribirnos</a>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-6 text-[13.5px] text-[#6E8094] md:flex-row md:items-center md:justify-between">
        <span>Contenido bajo licencia abierta · citar con enlace a la fuente original</span>
        <span>Asunción, Paraguay</span>
      </div>
    </footer>
  );
}
