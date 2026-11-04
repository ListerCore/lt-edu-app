import Link from 'next/link';
import type { JSX } from 'react';
import { ChevronRight } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AnnouncementTabs } from '@/features/protected/announcements/components/announcement-tabs';
import { publicAnnouncements } from '@/features/protected/announcements/data/announcements-data';

// /news: the institution's public announcements, notices and alerts in tabs
export const NewsPage = (): JSX.Element => (
  <section aria-labelledby="news-title" className="mx-auto max-w-5xl px-6 pt-10 pb-20 md:px-8 md:pt-14 md:pb-28">
    <nav aria-label="Ruta">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="transition-colors hover:text-brand">
            Inicio
          </Link>
        </li>
        <li aria-current="page" className="flex items-center gap-1.5 font-medium text-foreground">
          <MorphIcon icon={ChevronRight} size={14} />
          Comunicados
        </li>
      </ol>
    </nav>
    <h1 id="news-title" className="mt-6 text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.08] font-semibold tracking-tight text-balance text-foreground">
      Comunicados, anuncios <span className="text-gradient">y avisos.</span>
    </h1>
    <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">Lo último de la institución para estudiantes, familias y docentes. Lo que es solo para tu sección o tu rol lo encuentras al ingresar a tu cuenta.</p>
    <div className="mt-10">
      <AnnouncementTabs announcements={publicAnnouncements} emptyText="Por ahora no hay publicaciones de este tipo." />
    </div>
  </section>
);
