import Link from 'next/link';

export function Marca({ conBajada = true }: { conBajada?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3.5 text-ink">
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand font-display text-base font-extrabold tracking-tight text-white">
        RN
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold tracking-tight">Realidad Nacional</span>
        {conBajada && (
          <span className="font-label text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted">
            Observatorio de la cátedra
          </span>
        )}
      </span>
    </Link>
  );
}
