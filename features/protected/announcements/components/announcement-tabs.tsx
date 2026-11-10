'use client';

import type { JSX } from 'react';
import { Inbox } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { announcementKinds, kindMeta } from '../data/announcements-data';
import type { AnnouncementTabsProps } from '../types';
import { AnnouncementCard } from './announcement-card';

// Anuncios / Comunicados / Avisos tabs with a count each; shared by the panel and the public /news page
export const AnnouncementTabs = ({ announcements, isLoading = false, emptyText, context }: AnnouncementTabsProps): JSX.Element => (
  <Tabs defaultValue={announcementKinds[0]}>
    <TabsList variant="line" className="w-full justify-start gap-4 border-b border-border pb-1">
      {announcementKinds.map((kind): JSX.Element => {
        const count = announcements.filter((item) => item.kind === kind).length;
        return (
          <TabsTrigger key={kind} value={kind} className="flex-none px-1 data-active:text-brand group-data-[variant=line]/tabs-list:data-active:after:bg-brand">
            <MorphIcon icon={kindMeta[kind].icon} size={16} />
            {kindMeta[kind].plural}
            {!isLoading && <span className="rounded-full bg-accent px-1.5 font-mono text-[11px] tabular-nums">{count}</span>}
          </TabsTrigger>
        );
      })}
    </TabsList>

    {announcementKinds.map((kind): JSX.Element => {
      const items = announcements.filter((item) => item.kind === kind);
      return (
        <TabsContent key={kind} value={kind} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }, (_, index): JSX.Element => (
                <Skeleton key={index} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((announcement): JSX.Element => (
                <AnnouncementCard key={announcement.id} announcement={announcement} context={context} />
              ))}
            </div>
          ) : (
            <p className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
              <MorphIcon icon={Inbox} size={24} />
              {emptyText}
            </p>
          )}
        </TabsContent>
      );
    })}
  </Tabs>
);
