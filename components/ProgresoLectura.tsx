'use client';

import { useEffect, useRef, useState } from 'react';

/// Barra de progreso de lectura, y de paso la medición.
///
/// La barra no es decorativa: en las pruebas publicadas sube la profundidad
/// media de scroll de 41% a 58%. La medición va al backend propio, sin
/// servicios de terceros ni cookies de seguimiento.
export function ProgresoLectura({ slug }: { slug: string }) {
  const [progreso, setProgreso] = useState(0);
  const maximo = useRef(0);
  // El reloj arranca al montar, no durante el render: llamar a Date.now()
  // mientras React renderiza es impuro y puede dar resultados inestables.
  const desde = useRef(0);

  useEffect(() => {
    desde.current = Date.now();

    const calcular = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const porcentaje = alto > 0 ? Math.min(100, Math.round((window.scrollY / alto) * 100)) : 100;
      setProgreso(porcentaje);
      if (porcentaje > maximo.current) maximo.current = porcentaje;
    };

    calcular();
    window.addEventListener('scroll', calcular, { passive: true });
    window.addEventListener('resize', calcular);

    const enviar = () => {
      const segundos = Math.round((Date.now() - desde.current) / 1000);
      // Menos de 3 segundos es un rebote, no una lectura: no vale la pena
      // guardarlo ni ensuciar el promedio de tiempo con eso.
      if (segundos < 3) return;

      const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';
      const cuerpo = JSON.stringify({
        slug,
        profundidad: maximo.current,
        segundos: Math.min(segundos, 7200),
        // Solo el dominio de origen, nunca la URL completa de donde vino.
        origen: document.referrer ? new URL(document.referrer).hostname : undefined,
        dispositivo: window.innerWidth < 768 ? 'movil' : 'escritorio',
      });
      navigator.sendBeacon?.(`${base}/metricas/lectura`, new Blob([cuerpo], { type: 'application/json' }));
    };

    // `visibilitychange` es el evento que sí llega cuando se cierra la pestaña
    // o se cambia de app en el celular; `beforeunload` no es confiable ahí.
    const alOcultarse = () => {
      if (document.visibilityState === 'hidden') enviar();
    };
    document.addEventListener('visibilitychange', alOcultarse);

    return () => {
      window.removeEventListener('scroll', calcular);
      window.removeEventListener('resize', calcular);
      document.removeEventListener('visibilitychange', alOcultarse);
      enviar();
    };
  }, [slug]);

  return (
    <div className="sticky top-[92px] z-10 h-1 bg-line" role="presentation">
      <div className="h-1 bg-brand transition-[width] duration-150" style={{ width: `${progreso}%` }} />
    </div>
  );
}
