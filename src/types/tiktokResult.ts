export type ScanType =
  | "search_users"
  | "relations"
  | "creator_by_region"
  | "comments"
  | "top-posts"


export type ScanResult<T> = {
  scan_type: ScanType | null;
  items: T[];
};