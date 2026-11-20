// Pagination block of every paged list returned by lt-edu-api
export interface Pagination {
  has_prev_page: boolean;
  has_next_page: boolean;
  page_size: number;
  current_page: number;
  total_items: number;
  total_pages: number;
}

// meta of a paged list: search and filters as the API applied them (after validation), plus the pagination
export interface ListMeta<F extends Record<string, string> = Record<string, string>> {
  search_query: string;
  filter: F;
  pagination: Pagination;
}

export interface ListResponse<T, F extends Record<string, string> = Record<string, string>> {
  data: T[];
  meta: ListMeta<F>;
}

// Page sizes the panel offers
export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

// Slices an in-memory list the way lt-edu-api will page it (used by the simulated actions)
export const paginate = <T>(items: T[], page: number, pageSize: number): { data: T[]; pagination: Pagination } => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    data: items.slice((current - 1) * pageSize, current * pageSize),
    pagination: { has_prev_page: current > 1, has_next_page: current < totalPages, page_size: pageSize, current_page: current, total_items: items.length, total_pages: totalPages },
  };
};
