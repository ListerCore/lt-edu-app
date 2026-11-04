import type { RefObject } from 'react';
import type { ListMeta, ListResponse, Pagination } from '@/lib/api/list';
import type { InstitutionType } from '@/features/protected/dashboard/types';

// carnet = CR80 card, landscape; fotocheck = same card in portrait with the lanyard slot
export type CardFormat = 'carnet' | 'fotocheck';

export type CardholderGroup = 'students' | 'staff';

export type CardSide = 'front' | 'back';

export interface Cardholder {
  id: string;
  group: CardholderGroup;
  name: string;
  // Grade/section, cycle or program for students; position for staff
  detail: string;
  code: string;
  documentNumber: string;
  // Photo URL; null prints the silhouette
  photoUrl: string | null;
  // Printed on the back: the guardian for students, a relative for staff
  emergencyName: string;
  emergencyPhone: string;
}

export interface CardFormatSpec {
  label: string;
  description: string;
  widthMm: number;
  heightMm: number;
}

// What the card prints about the institution
export interface CardIssuer {
  institutionName: string;
  institutionType: InstitutionType;
  validity: string;
  address: string;
  phone: string;
  website: string;
  signatory: string;
}

export interface CardActionResult<T> {
  ok: boolean;
  message: string;
  data?: T;
}

// Filters the cardholders list accepts (echoed back in meta.filter)
export interface CardholdersFilter extends Record<string, string> {
  group: CardholderGroup;
}

export interface GetCardholdersParams {
  institutionType: InstitutionType;
  group: CardholderGroup;
  search: string;
  page: number;
  pageSize: number;
}

export type CardholdersResponse = ListResponse<Cardholder, CardholdersFilter>;

export interface UseGetCardholdersResult {
  cardholders: Cardholder[];
  meta: ListMeta<CardholdersFilter> | null;
  // First load (nothing to show yet) vs. refetch (keeps the previous page on screen)
  isLoading: boolean;
  isFetching: boolean;
}

export interface UseGetOwnCardholderResult {
  cardholder: Cardholder | null;
  isLoading: boolean;
}

export interface UseUpdateCardholderPhotoResult {
  setPhoto: (id: string, file: File) => void;
  error: string | null;
  isPending: boolean;
}

export interface CardholdersPaginationProps {
  pagination: Pagination;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}

export interface CardExportItem {
  svg: SVGSVGElement | null;
  fileName: string;
}

export interface UseDownloadCardResult {
  // Downloads every face given (front and back), one PNG each
  download: (items: CardExportItem[]) => void;
  isDownloading: boolean;
}

export interface UsePrintCardsResult {
  printing: Cardholder[];
  print: (cardholders: Cardholder[]) => void;
}

export interface IdCardSvgProps {
  cardholder: Cardholder;
  issuer: CardIssuer;
  format: CardFormat;
  side?: CardSide;
  // Keeps clipPath ids unique when the same card is drawn twice on the page (preview + zoom)
  idPrefix?: string;
  svgRef?: RefObject<SVGSVGElement | null>;
  className?: string;
}

export interface CardZoomDialogProps {
  cardholder: Cardholder;
  issuer: CardIssuer;
  format: CardFormat;
  // Face being shown; null keeps the dialog closed
  side: CardSide | null;
  onSideChange: (side: CardSide | null) => void;
}

export interface CardFormatToggleProps {
  value: CardFormat;
  onChange: (format: CardFormat) => void;
}

export interface CardPreviewPanelProps {
  cardholder: Cardholder;
  issuer: CardIssuer;
  format: CardFormat;
  onFormatChange: (format: CardFormat) => void;
  onPrint: () => void;
  // Photo upload (simulated); omitted for roles that cannot change photos
  onPhotoSelect?: (file: File) => void;
  photoError?: string | null;
  isPhotoPending?: boolean;
}

export interface CardholdersListProps {
  cardholders: Cardholder[];
  isFetching: boolean;
  selectedIds: string[];
  activeId: string | null;
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onPreview: (id: string) => void;
}

export interface CardsPrintSheetProps {
  cardholders: Cardholder[];
  issuer: CardIssuer;
  format: CardFormat;
}
