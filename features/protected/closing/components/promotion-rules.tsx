'use client';

import { useState, useTransition, type JSX } from 'react';
import { Pencil, RotateCcw, Scale } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { resetPromotionRuleAction } from '../actions/reset-promotion-rule';
import { savePromotionRuleAction } from '../actions/save-promotion-rule';
import type { PromotionRule, PromotionRules } from '../types';

const ruleText = (automatic: boolean, areas: number): string => (automatic ? 'Promoción automática' : `${areas} ${areas === 1 ? 'área' : 'áreas'} con A o AD en la mitad o más de sus competencias, sin C`);

// The promotion rule of each EBA cycle: the CEBA may set its own (decision D4 of docs/ceba/PLAN.md); it applies to
// the sections not confirmed yet
export const PromotionRulesPanel = ({ slug, rules, onChange }: { slug: string; rules: PromotionRules; onChange: () => void }): JSX.Element => {
  const [editing, setEditing] = useState<PromotionRule | null>(null);
  const [isPending, start] = useTransition();
  const reset = (r: PromotionRule): void =>
    start(async () => {
      const res = await runAcademicAction(resetPromotionRuleAction(slug, r.levelId));
      if (res.ok) onChange();
    });
  return (
    <section aria-labelledby="promotion-rules" className="space-y-3">
      <div>
        <h2 id="promotion-rules" className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <MorphIcon icon={Scale} size={18} className="text-brand" />
          Reglas de promoción por ciclo
        </h2>
        <p className="text-sm text-muted-foreground">Las fija el CEBA según la norma de evaluación vigente. Un cambio no toca las secciones ya confirmadas.</p>
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
        {rules.rules.map((r) => (
          <li key={r.levelId} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <span className="w-36 font-medium text-foreground">{r.levelName}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-foreground">{ruleText(r.automatic, r.areas)}</span>
              <span className="block text-xs text-muted-foreground">
                {r.custom ? `Regla del CEBA${r.note ? ` · ${r.note}` : ''} · ${r.updatedName}${r.updatedAt ? `, ${formatDay(r.updatedAt.slice(0, 10))}` : ''}` : `Por defecto: ${r.defaultName}`}
              </span>
            </span>
            {r.custom && <span className="pill bg-brand-soft text-brand">Propia</span>}
            {rules.canManage && (
              <span className="flex gap-1">
                <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setEditing(r)}>
                  <MorphIcon icon={Pencil} size={14} />
                  Cambiar
                </button>
                {r.custom && (
                  <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={isPending} onClick={(): void => reset(r)}>
                    <MorphIcon icon={RotateCcw} size={14} />
                    Por defecto
                  </button>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
      {editing && <RuleDialog slug={slug} rule={editing} onClose={(): void => setEditing(null)} onSaved={(): void => (setEditing(null), onChange())} />}
    </section>
  );
};

const RuleDialog = ({ slug, rule, onClose, onSaved }: { slug: string; rule: PromotionRule; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const [automatic, setAutomatic] = useState(rule.automatic);
  const [areas, setAreas] = useState(String(rule.areas || rule.defaultAreas));
  const [note, setNote] = useState(rule.note);
  const [isPending, start] = useTransition();
  const n = Number(areas);
  const invalid = !automatic && (!Number.isInteger(n) || n < 1 || n > 12);
  const submit = (): void =>
    start(async () => {
      const res = await runAcademicAction(savePromotionRuleAction(slug, { levelId: rule.levelId, automatic, areas: automatic ? 0 : n, note: note.trim() }));
      if (res.ok) onSaved();
    });
  return (
    <FormDialog title={`Regla de promoción · ${rule.levelName}`} description={`Por defecto: ${rule.defaultName}. Permanece en el grado con C en más de la mitad de las competencias de ese mismo número de áreas; lo demás va a recuperación.`} submitLabel="Guardar regla" isPending={isPending} disabled={invalid} onSubmit={submit} onClose={onClose}>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={automatic} onChange={(e): void => setAutomatic(e.target.checked)} className="size-4 accent-brand" />
        Promoción automática (sin condiciones)
      </label>
      {!automatic && (
        <FormField id="rule-areas" label="Áreas que debe aprobar" required error={invalid ? 'Indica entre 1 y 12 áreas.' : undefined} hint="Áreas con A o AD en la mitad o más de sus competencias, sin ninguna C.">
          <Input id="rule-areas" type="number" min={1} max={12} inputMode="numeric" value={areas} onChange={(e): void => setAreas(e.target.value)} className="w-28" />
        </FormField>
      )}
      <FormField id="rule-note" label="Sustento" hint="La norma o el acuerdo que la respalda; se muestra junto a la regla.">
        <Textarea id="rule-note" rows={3} maxLength={300} placeholder="RVM N.° 094-2020-MINEDU y modificatorias" value={note} onChange={(e): void => setNote(e.target.value)} />
      </FormField>
    </FormDialog>
  );
};
