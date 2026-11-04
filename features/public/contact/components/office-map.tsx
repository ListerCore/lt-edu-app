'use client';

import type { JSX } from 'react';
import { MapPin } from 'lucide';
import { useTheme } from '@/components/providers/theme';
import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel } from '@/components/ui/map';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { OfficeMapProps } from '../types';

const { latitude, longitude } = siteConfig.office;

// Two-finger / modifier+scroll gestures, so the map never traps page scrolling
const gestureLocale = {
  'CooperativeGesturesHandler.WindowsHelpText': 'Usa Ctrl + desplazamiento para hacer zoom',
  'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ + desplazamiento para hacer zoom',
  'CooperativeGesturesHandler.MobileHelpText': 'Usa dos dedos para mover el mapa',
};

// Office map (mapcn / MapLibre) pinned on the office, following the site theme; the container sets its height
export const OfficeMap = ({ className, zoom = 15 }: OfficeMapProps): JSX.Element => {
  const { resolvedTheme } = useTheme();

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border', className)}>
      <Map theme={resolvedTheme} center={[longitude, latitude]} zoom={zoom} cooperativeGestures locale={gestureLocale}>
        <MapMarker longitude={longitude} latitude={latitude}>
          <MarkerContent>
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-solid text-white shadow-lg ring-4 ring-brand-soft">
              <MorphIcon icon={MapPin} size={18} />
            </span>
          </MarkerContent>
          <MarkerLabel position="bottom" className="font-semibold text-foreground">
            {siteConfig.name}
          </MarkerLabel>
        </MapMarker>
        <MapControls position="top-right" showZoom />
      </Map>
    </div>
  );
};
