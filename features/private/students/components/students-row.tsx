import type { JSX } from 'react';
import { Eye } from 'lucide-react';
import type { StudentsRowProps } from '../types';

export const StudentsRow = ({ student }: StudentsRowProps): JSX.Element => {
  return (
    <tr className="hover:bg-[#191F2F]/60 transition-colors">
      <td className="py-4 px-4 md:px-6">
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-emerald-400">{student.code}</span>
          <span className="font-semibold text-white text-sm">{student.fullName}</span>
          <span className="text-xs text-[#94A3B8]">DNI: {student.dni}</span>
        </div>
      </td>

      <td className="py-4 px-4 whitespace-nowrap">
        <span className="inline-flex items-center rounded-md border border-[#2D4163] bg-[#0B1528] px-2.5 py-1 text-xs font-medium text-emerald-300">{student.cycle}</span>
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-xs text-[#94A3B8]">
        <div className="flex flex-col">
          <span className="text-white font-medium">{student.modality}</span>
          <span>Turno {student.shift}</span>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white font-mono">{student.attendanceRate}%</span>
          <div className="h-1.5 w-16 rounded-full bg-[#0B1528] overflow-hidden">
            <div className={`h-full rounded-full ${student.attendanceRate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${student.attendanceRate}%` }} />
          </div>
        </div>
      </td>

      <td className="py-4 px-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            student.status === 'MATRICULADO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : student.status === 'EGRESADO' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}
        >
          {student.status}
        </span>
      </td>

      <td className="py-4 px-4 text-right whitespace-nowrap">
        <button type="button" title="Ver Ficha" className="inline-flex items-center gap-1 rounded-lg border border-[#22334F] bg-[#0B1528] px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-emerald-500 transition-all cursor-pointer">
          <Eye className="h-3.5 w-3.5 text-emerald-400" />
          <span>Ficha</span>
        </button>
      </td>
    </tr>
  );
};
