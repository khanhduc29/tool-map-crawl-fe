export type ScanType =
  | "search_users"
  | "relations"
  | "search_videos"
  | "creator_by_region"
  | "comments"


export type ScanResult<T> = {
  scan_type: ScanType | null;
  items: T[];
};