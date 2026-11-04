'use client';

import { useEffect, useState, type JSX } from 'react';
import { Printer, Search } from 'lucide';
import { Input } from '@/components/ui/input';
import { ListPagination } from '@/components/ui/list-pagination';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { DEFAULT_PAGE_SIZE } from '@/lib/api/list';
import { siteConfig } from '@/lib/site';
import { useCardholderPhotos } from '../hooks/use-cardholder-photos';
import { useGetCardholders } from '../hooks/use-get-cardholders';
import { useGetOwnCardholder } from '../hooks/use-get-own-cardholder';
import { usePrintCards } from '../hooks/use-print-cards';
import { useUpdateCardholderPhoto } from '../hooks/use-update-cardholder-photo';
import type { CardFormat, Cardholder, CardholderGroup, CardIssuer } from '../types';
import { CardPreviewPanel } from './card-preview-panel';
import { CardholdersList } from './cardholders-list';
import { CardsPrintSheet } from './cards-print-sheet';

const VALIDITY = '2026';
const SEARCH_DEBOUNCE_MS = 300;

// Cards module: managers page through the roster, pick people and batch-print; everyone else gets their own card
export const CardsPage = (): JSX.Element => {
  const { institutionType, institutionName, role, can } = useWorkspace();
  const canManage = can('cards', 'create');
  const issuer: CardIssuer = { institutionName, institutionType, validity: VALIDITY, address: siteConfig.office.address, phone: siteConfig.phone, website: siteConfig.domain, signatory: 'Dirección' };

  const [format, setFormat] = useState<CardFormat>('carnet');
  const [group, setGroup] = useState<CardholderGroup>('students');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  // Kept as objects so the selection survives page changes and prints people from several pages
  const [selected, setSelected] = useState<Record<string, Cardholder>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  // Debounced search; a new search starts again at page 1
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(query);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const { cardholders, meta, isLoading, isFetching } = useGetCardholders({ institutionType, group, search, page, pageSize });
  const own = useGetOwnCardholder(institutionType, role, !canManage);
  const photos = useCardholderPhotos();
  const { setPhoto, error: photoError, isPending: isPhotoPending } = useUpdateCardholderPhoto();
  const { printing, print } = usePrintCards();

  const withPhoto = (person: Cardholder): Cardholder => (photos[person.id] ? { ...person, photoUrl: photos[person.id] } : person);
  const selectedList = Object.values(selected).map(withPhoto);
  const active = canManage ? (cardholders.find(({ id }) => id === activeId) ?? (activeId && selected[activeId] ? withPhoto(selected[activeId]) : null) ?? cardholders[0] ?? null) : own.cardholder;

  const toggle = (id: string, checked: boolean): void =>
    setSelected((current) => {
      const next = { ...current };
      const person = cardholders.find((item) => item.id === id);
      if (checked && person) next[id] = person;
      else delete next[id];
      return next;
    });
  const toggleAll = (checked: boolean): void =>
    setSelected((current) => {
      const next = { ...current };
      for (const person of cardholders) {
        if (checked) next[person.id] = person;
        else delete next[person.id];
      }
      return next;
    });

  const changeGroup = (value: CardholderGroup): void => {
    setGroup(value);
    setPage(1);
    setActiveId(null);
  };

  const showPreview = !(canManage ? isLoading : own.isLoading) && active;

  return (
    <section aria-labelledby="cards-title" className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="cards-title" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {canManage ? 'Carnets' : role === 'guardian' ? 'Carnet de tu hijo' : 'Mi carnet'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{canManage ? 'La foto de cada persona es la que se imprime en su carnet o fotocheck.' : 'Descárgalo o imprímelo en formato carnet o fotocheck.'}</p>
        </div>
        {canManage && (
          <button type="button" disabled={selectedList.length === 0} onClick={(): void => print(selectedList)} className="btn-brand">
            <MorphIcon icon={Printer} size={16} />
            Imprimir seleccionados{selectedList.length > 0 ? ` (${selectedList.length})` : ''}
          </button>
        )}
      </header>

      <div className={canManage ? 'mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]' : 'mt-8 max-w-xl'}>
        {canManage && (
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Tabs value={group} onValueChange={(value): void => changeGroup(value as CardholderGroup)}>
                <TabsList>
                  <TabsTrigger value="students">{institutionType === 'CEPRE' ? 'Alumnos' : 'Estudiantes'}</TabsTrigger>
                  <TabsTrigger value="staff">Personal</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full sm:w-64">
                <MorphIcon icon={Search} size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" aria-label="Buscar por nombre, código o sección" placeholder="Buscar nombre o código" value={query} onChange={(event): void => setQuery(event.target.value)} className="h-9 rounded-lg pl-9" />
              </div>
            </div>

            {isLoading || !meta ? (
              <Skeleton className="h-[34rem] rounded-xl" />
            ) : (
              <>
                <CardholdersList cardholders={cardholders} isFetching={isFetching} selectedIds={Object.keys(selected)} activeId={active?.id ?? null} onToggle={toggle} onToggleAll={toggleAll} onPreview={setActiveId} />
                {meta.pagination.total_items > 0 && (
                  <ListPagination
                    pagination={meta.pagination}
                    noun={group === 'students' ? (institutionType === 'CEPRE' ? 'alumnos' : 'estudiantes') : 'personas'}
                    onPage={setPage}
                    onPageSize={(size): void => {
                      setPageSize(size);
                      setPage(1);
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}

        <div className="lg:sticky lg:top-20 lg:self-start">
          {showPreview ? <CardPreviewPanel cardholder={active} issuer={issuer} format={format} onFormatChange={setFormat} onPrint={(): void => print([active])} onPhotoSelect={canManage ? (file): void => setPhoto(active.id, file) : undefined} photoError={photoError} isPhotoPending={isPhotoPending} /> : <Skeleton className="h-[28rem] rounded-2xl" />}
        </div>
      </div>

      <CardsPrintSheet cardholders={printing} issuer={issuer} format={format} />
    </section>
  );
};
