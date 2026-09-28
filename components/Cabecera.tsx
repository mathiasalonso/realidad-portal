import Link from 'next/link';
import { Marca } from './Marca';

export function Cabecera() {
  return (
    <>
      <div className="flex h-[42px] items-center justify-between bg-deep px-6 font-label text-[12.5px] tracking-wide text-[#C7D9EA] md:px-[130px]">
        <span className="truncate">Facultad Politécnica · Universidad Nacional de Asunción</span>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/metodo" className="text-[#C7D9EA] hover:text-white">La cátedra</Link>
          <span className="text-[#5B7B98]">·</span>
          <span className="font-semibold text-white">ES</span>
        </div>
      </div>

      <header className="sticky top-0 z-20 flex h-[92px] items-center justify-between border-b border-line bg-surface/95 px-6 backdrop-blur md:px-[130px]">
        <Marca />
        <nav className="hidden items-center gap-9 md:flex">
          <Link href="/" className="font-display text-[15.5px] font-medium text-[#33404D] hover:text-brand-action">Análisis</Link>
          <Link href="/temas" className="font-display text-[15.5px] font-medium text-[#33404D] hover:text-brand-action">Temas</Link>
          <Link href="/datos" className="font-display text-[15.5px] font-medium text-[#33404D] hover:text-brand-action">Datos</Link>
          <Link href="/metodo" className="font-display text-[15.5px] font-medium text-[#33404D] hover:text-brand-action">Método</Link>
        </nav>
        <Link
          href="#suscribir"
          className="inline-flex h-[46px] items-center rounded-[13px] bg-brand-action px-6 font-display text-[15px] font-semibold text-white hover:bg-brand-dark"
        >
          Suscribirme
        </Link>
      </header>
    </>
  );
}
