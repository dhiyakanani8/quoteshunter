export interface SheetMessage {
  _rowNumber: number;
  username: string;
  userID: string;
  content: string;
  imageURL?: string;
  timestamp?: string;
  likes?: number | string;
  reposts?: number | string;
  bookmarks?: number | string;
  views?: number | string;
  tweetURL?: string;
  types?: string;
  datetime?: string;
  [key: string]: any;
}

export interface SheetResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  data: SheetMessage[];
}

export type ViewLayout = 'grid' | 'list' | 'masonry';
