// data/mockByTab.ts
import { FAKE_ACCOUNTS } from "./tiktokAccounts";

export const MOCK_DATA_BY_TAB = {
  "top-posts": {
    scanType: "search_videos",
    results: [], // sau này fake videos
  },
  videos: {
    scanType: "search_videos",
    results: [], // fake videos
  },
  accounts: {
    scanType: "search_users",
    results: FAKE_ACCOUNTS,
  },
  friends: {
    scanType: "relations",
    results: FAKE_ACCOUNTS.slice(0, 4), // demo network
  },
  creators: {
    scanType: "search_users",
    results: [],
  },
} as const;