'use client';

import { useState, type JSX } from 'react';
import { Settings2 } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { variantLabels } from '../data/participation-data';
import { usePermanencePage } from '../hooks/use-permanence-page';
import type { AdjustTarget } from '../types';
import { AdjustDialog } from './adjust-dialog';
import { RuleDialog } from './rule-dialog';
import { SectionTable } from './section-table';

// Permanencia (EBA, forma a distancia): the platform records what each student does; this page reads it week by
// week with the CEBA's rule. In person and blended sections keep the attendance by session
export const PermanencePage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const page = usePermanencePage();
  const [ruleOpen, setRuleOpen] = useState(false);
  const [adjusting, setAdjusting] = useState<AdjustTarget | null>(null);
  const board = page.board.data;
  const rule = board?.rule;

  return (
    <AcademicPage
      wide
      titleId="permanence-title"
      title="Permanencia a distancia"
      description="Se calcula sola con lo que cada estudiante hace en la plataforma: ingresos, materiales, sesiones en vivo, entregas y foros. El tutor puede ajustar una semana con justificación."
      context={board ? { canManage: board.canEditRule } : null}
      actions={
        board?.canEditRule && (
          <button type="button" className="btn-alt" onClick={(): void => setRuleOpen(true)}>
            <MorphIcon icon={Settings2} size={16} />
            Regla de permanencia
          </button>
        )
      }
    >
      {page.board.error ? (
        <LoadError message={page.board.error} onRetry={page.board.reload} />
      ) : !board ? (
        <PageSkeleton />
      ) : board.sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">El periodo en curso no tiene secciones a distancia. Créalas en la estructura académica.</p>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-80">
              <SelectField
                id="permanence-section"
                value={page.sectionId}
                options={board.sections.map((s) => ({ value: s.id, label: `${s.gradeName} ${s.name} · ${s.levelName} · ${variantLabels[s.variant] ?? ''} (${s.students})` }))}
                onChange={page.setSectionId}
              />
            </div>
            {rule && (
              <p className="text-sm text-muted-foreground">
                Regla: al menos {rule.minActiveDays} {rule.minActiveDays === 1 ? 'día' : 'días'} con actividad cada {rule.windowDays} días · alerta tras {rule.inactiveDays} días sin conexión o bajo {rule.lowPercent} %
              </p>
            )}
          </div>
          {page.section.error ? (
            <LoadError message={page.section.error} onRetry={page.section.reload} />
          ) : !page.section.data ? (
            <PageSkeleton />
          ) : (
            <SectionTable slug={slug} sectionId={page.sectionId} data={page.section.data} onAdjust={setAdjusting} />
          )}
        </div>
      )}
      {ruleOpen && rule && <RuleDialog slug={slug} rule={rule} onClose={(): void => setRuleOpen(false)} onSaved={page.board.reload} />}
      {adjusting && <AdjustDialog slug={slug} target={adjusting} onClose={(): void => setAdjusting(null)} onSaved={page.section.reload} />}
    </AcademicPage>
  );
};
