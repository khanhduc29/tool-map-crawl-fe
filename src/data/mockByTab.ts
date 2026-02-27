// data/mockByTab.ts
import { FAKE_ACCOUNTS, FAKE_COMMENTS, FAKE_RELATIONS } from "./tiktokAccounts";

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
    results: FAKE_RELATIONS, 
  },
  creators: {
    scanType: "search_users",
    results: [],
  },
  comments: {
    scanType: "comments",
    results: FAKE_COMMENTS, // sau này fake comments
  },
} as const;