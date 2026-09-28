'use client';

/// La descarga se registra en el backend propio antes de abrir el archivo.
/// Para este proyecto una descarga de datos dice más que un clic.
export function DescargarDataset({
  archivo,
  datasetVersionId,
  analisisSlug,
}: {
  archivo: string;
  datasetVersionId?: string;
  analisisSlug?: string;
}) {
  const registrar = () => {
    if (!datasetVersionId) return;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';
    const cuerpo = JSON.stringify({ datasetVersionId, analisisSlug });
    // sendBeacon no bloquea la navegación ni se pierde si la página se cierra.
    navigator.sendBeacon?.(`${base}/metricas/descarga`, new Blob([cuerpo], { type: 'application/json' }));
  };

  return (
    <a
      href={`#${archivo}`}
      onClick={registrar}
      className="font-display text-[12.5px] font-semibold text-brand-action hover:text-brand-dark"
      title="Pendiente: servir el archivo del dataset"
    >
      Descargar CSV
    </a>
  );
}
