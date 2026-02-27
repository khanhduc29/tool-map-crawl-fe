import { useEffect, useState } from "react";
import { Users, UserPlus } from "lucide-react";
import { TikTokAccount } from "../../types/tiktok";
import { FAKE_ACCOUNTS, FAKE_COMMENTS } from "../../data/tiktokAccounts";
import { ScanType } from "../../types/tiktokResult";
import ResultList from "../../components/tiktok/ResultList";
import { MOCK_DATA_BY_TAB } from "../../data/mockByTab";

type TabKey =
  | "top-posts"
  | "videos"
  | "accounts"
  | "friends"
  | "creators"
  | "comments";

export default function TikTokTool() {
  const [tab, setTab] = useState<TabKey>("top-posts");
  const [accountKeyword, setAccountKeyword] = useState("");
  const [limit, setLimit] = useState(3);
  const [deepScan, setDeepScan] = useState(true);

  const [sourceUsername, setSourceUsername] = useState("");
  const [relationLimit, setRelationLimit] = useState(50);
  const [relationDeepScan, setRelationDeepScan] = useState(false);
  const [scanType, setScanType] = useState<ScanType | null>(null);
  const [results, setResults] = useState<any[]>([]);

  // ===== COMMENTS SCAN =====
  const [commentKeyword, setCommentKeyword] = useState("");
  const [commentVideoUrl, setCommentVideoUrl] = useState("");
  const [commentLimit, setCommentLimit] = useState(200);

  useEffect(() => {
    const mock = MOCK_DATA_BY_TAB[tab];
    if (!mock) return;

    setScanType(mock.scanType as ScanType);
    setResults([...mock.results]); // 👈 clone → mutable
  }, [tab]);
  const buildScanUsersForm = () => {
    const form = {
      scan_type: "search_users",
      scan_account: "tool_bot_01",
      keyword: accountKeyword,
      limit,
      delay_range: [2500, 5000],
      batch_size: 5,
      batch_delay: 8000,
      deep_scan: deepScan,
      scan_relations: false,
      scan_comments: false,
    };

    console.log("📤 SCAN USERS FORM:", form);

    setScanType("search_users"); // 👈 QUAN TRỌNG
    setResults(FAKE_ACCOUNTS);
  };
  const buildScanRelationsForm = () => {
    const form = {
      scan_type: "relations",
      scan_account: "tool_bot_01",
      source_username: sourceUsername,
      limit: relationLimit,
      delay_range: [3000, 6000],
      batch_size: 10,
      batch_delay: 12000,
      deep_scan: relationDeepScan,
    };

    console.log("📤 SCAN RELATIONS FORM:", form);

    setScanType("relations"); // 👈
    setResults([]); // sau này thay bằng FAKE_RELATIONS
  };

  const buildScanCommentsForm = () => {
    const form = {
      scan_type: "comments",
      scan_account: "tool_bot_01",

      keyword: commentKeyword,
      video_url: commentVideoUrl,
      limit: commentLimit,

      delay_range: [2000, 4000],
      batch_size: 20,
      batch_delay: 10000,

      detect_intent: true,
    };

    console.log("📤 SCAN COMMENTS FORM:", form);

    setScanType("comments"); // 👈 QUAN TRỌNG
    setResults([]);
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <h1 style={title}>TikTok Crawler</h1>
      <p style={subtitle}>
        Quét dữ liệu TikTok theo từ khóa, tài khoản và khu vực – demo giao diện
        & dữ liệu giả.
      </p>

      {/* TABS */}
      <div style={tabs}>
        <Tab label="Top bài viết" value="top-posts" tab={tab} setTab={setTab} />
        <Tab
          label="Video theo từ khóa"
          value="videos"
          tab={tab}
          setTab={setTab}
        />
        <Tab
          label="Tài khoản theo từ khóa"
          value="accounts"
          tab={tab}
          setTab={setTab}
          onChange={() => {
            setResults([]);
            setScanType(null);
          }}
        />
        <Tab
          label="Bạn bè tài khoản"
          value="friends"
          tab={tab}
          setTab={setTab}
        />
        <Tab
          label="Creator theo khu vực"
          value="creators"
          tab={tab}
          setTab={setTab}
        />
        <Tab
          label="Quét bình luận bài đăng"
          value="comments"
          tab={tab}
          setTab={setTab}
        />
      </div>

      {/* CONTENT */}
      <div style={layout}>
        {/* LEFT FORM */}
        <div style={left}>
          {tab === "top-posts" && (
            <>
              <h2>Quét top bài viết theo từ khóa</h2>
              <p>Dựa trên lượt xem và tương tác cao nhất</p>

              <input style={inputStyle} placeholder="Từ khóa (vd: makeup)" />
              <input
                style={inputStyle}
                type="number"
                placeholder="Số lượng (vd: 20)"
              />

              <button style={btn}>Quét dữ liệu</button>
            </>
          )}

          {tab === "videos" && (
            <>
              <h2>Quét video theo từ khóa</h2>
              <p>Tìm video mới hoặc nhiều lượt xem</p>

              <input style={inputStyle} placeholder="Hashtag hoặc keyword" />
              <select style={inputStyle}>
                <option>Mới nhất</option>
                <option>Nhiều lượt xem</option>
              </select>

              <button style={btn}>Bắt đầu quét</button>
            </>
          )}

          {tab === "accounts" && (
            <>
              <h2>Quét tài khoản theo từ khóa</h2>
              <p>Tìm KOL / creator theo ngành</p>

              <input
                style={inputStyle}
                placeholder="Từ khóa (vd: gym, studio)"
                value={accountKeyword}
                onChange={(e) => setAccountKeyword(e.target.value)}
              />

              <input
                style={inputStyle}
                type="number"
                placeholder="Số lượng (vd: 20)"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              />

              <label style={{ opacity: 0.85 }}>
                <input
                  type="checkbox"
                  checked={deepScan}
                  onChange={(e) => setDeepScan(e.target.checked)}
                />{" "}
                Quét chi tiết tài khoản
              </label>

              <button style={btn} onClick={buildScanUsersForm}>
                Quét tài khoản
              </button>
            </>
          )}

          {tab === "friends" && (
            <>
              <h2>Quét bạn bè của tài khoản</h2>
              <p>Quét toàn bộ network (following + follower)</p>

              <input
                style={inputStyle}
                placeholder="@username (vd: flowerknowsglobal)"
                value={sourceUsername}
                onChange={(e) => setSourceUsername(e.target.value)}
              />

              <input
                style={inputStyle}
                type="number"
                placeholder="Số lượng (vd: 50)"
                value={relationLimit}
                onChange={(e) => setRelationLimit(Number(e.target.value))}
              />

              <label style={{ opacity: 0.85 }}>
                <input
                  type="checkbox"
                  checked={relationDeepScan}
                  onChange={(e) => setRelationDeepScan(e.target.checked)}
                />{" "}
                Quét chi tiết từng tài khoản
              </label>

              <button style={btn} onClick={buildScanRelationsForm}>
                Quét bạn bè
              </button>
            </>
          )}

          {tab === "creators" && (
            <>
              <h2>Tìm creator theo khu vực</h2>
              <p>Lọc creator theo vị trí & ngành</p>

              <input style={inputStyle} placeholder="Thành phố / Quốc gia" />
              <input style={inputStyle} placeholder="Ngành (beauty, food...)" />

              <button style={btn}>Tìm creator</button>
            </>
          )}
          {tab === "comments" && (
            <>
              <h2>Quét bình luận bài đăng</h2>
              <p>Lọc comment theo keyword trong video</p>

              <input
                style={inputStyle}
                placeholder="Keyword (vd: makeup)"
                value={commentKeyword}
                onChange={(e) => setCommentKeyword(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="TikTok video URL"
                value={commentVideoUrl}
                onChange={(e) => setCommentVideoUrl(e.target.value)}
              />

              <input
                style={inputStyle}
                type="number"
                placeholder="Số lượng comment (vd: 200)"
                value={commentLimit}
                onChange={(e) => setCommentLimit(Number(e.target.value))}
              />

              <button style={btn} onClick={buildScanCommentsForm}>
                Quét bình luận
              </button>
            </>
          )}
        </div>

        {/* RIGHT RESULT */}
        <div style={right}>
          <ResultList scanType={scanType} results={results} limit={limit} />
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ label, value, tab, setTab, onChange }: any) {
  return (
    <button
      onClick={() => {
        setTab(value);
        onChange?.(); // 👈 reset state
      }}
      style={{
        ...tabBtn,
        ...(tab === value ? tabActive : {}),
      }}
    >
      {label}
    </button>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 60,
  minHeight: "100vh",
  background: "linear-gradient(180deg,#0b2cff,#061a6b)",
  color: "#fff",
};

const title = { fontSize: 42, marginBottom: 8 };
const subtitle = { opacity: 0.85, marginBottom: 32 };

const tabs = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
  marginBottom: 32,
};

const tabBtn = {
  padding: "10px 18px",
  borderRadius: 999,
  border: "none",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  cursor: "pointer",
};

const tabActive = { background: "#FF4331" };

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 888px",
  gap: 60,
  //   maxWidth: 1200,
};

const left = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
};

const right = {};

const inputStyle = {
  padding: "14px 16px",
  borderRadius: 12,
  border: "none",
  outline: "none",
};

const btn = {
  marginTop: 8,
  background: "#FF4331",
  border: "none",
  color: "#fff",
  padding: "14px 24px",
  borderRadius: 12,
  cursor: "pointer",
};
