import type { JSX } from 'react';
import { Calendar, Eye, MapPin, Users } from 'lucide-react';
import type { DashboardTableRowProps, EventCategory, EventStatus } from '../types';

const getStatusBadge = (status: EventStatus): JSX.Element => {
  switch (status) {
    case 'ACTIVO':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Activo
        </span>
      );
    case 'PENDIENTE':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Pendiente
        </span>
      );
    case 'FINALIZADO':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Finalizado
        </span>
      );
    case 'CANCELADO':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          Cancelado
        </span>
      );
    default:
      return <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300">{status}</span>;
  }
};

const getCategoryBadge = (category: EventCategory): JSX.Element => {
  const categoryLabels: Record<EventCategory, { label: string; color: string }> = {
    CONFERENCIA: {
      label: 'Conferencia',
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    },
    TALLER: {
      label: 'Taller Práctico',
      color: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
    },
    SEMINARIO: {
      label: 'Seminario',
      color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    },
    CIRUGIA_DEMO: {
      label: 'Demostración Quirúrgica',
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    SIMPOSIO: {
      label: 'Simposio',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    CAPACITACION: {
      label: 'Capacitación',
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    },
  };

  const item = categoryLabels[category] || {
    label: category,
    color: 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10',
  };

  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${item.color}`}>{item.label}</span>;
};

const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

export const DashboardTableRow = ({ event }: DashboardTableRowProps): JSX.Element => {
  const occupancyPercent = event.maxCapacity > 0 ? Math.round((event.attendeesCount / event.maxCapacity) * 100) : 0;

  return (
    <tr className="hover:bg-[#191F2F]/60 transition-colors group">
      <td className="py-4 px-4 md:px-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs font-bold text-indigo-400">{event.code}</span>
          <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{event.name}</span>
          <span className="text-xs text-[#908FA0]">
            Resp: <strong className="text-zinc-300">{event.organizer}</strong>
          </span>
        </div>
      </td>

      <td className="py-4 px-4 whitespace-nowrap">{getCategoryBadge(event.category)}</td>

      <td className="py-4 px-4">
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-200">
            <Calendar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#908FA0]">
            <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="truncate max-w-50">{event.location}</span>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex flex-col gap-1.5 min-w-32.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-zinc-300">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              <strong>{event.attendeesCount}</strong> / {event.maxCapacity}
            </span>
            <span className="text-[11px] font-mono text-[#908FA0]">{occupancyPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#0C1322] overflow-hidden">
            <div className={`h-full rounded-full transition-all ${occupancyPercent >= 90 ? 'bg-rose-500' : occupancyPercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(occupancyPercent, 100)}%` }} />
          </div>
        </div>
      </td>

      <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(event.status)}</td>

      <td className="py-4 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          <button type="button" title="Ver detalles del evento" className="inline-flex items-center gap-1 rounded-lg border border-[#2E3545] bg-[#0C1322]/80 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all cursor-pointer">
            <Eye className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ver</span>
          </button>
        </div>
      </td>
    </tr>
  );
};
