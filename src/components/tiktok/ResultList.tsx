import { useEffect, useMemo, useState } from "react";
import AccountCard from "./AccountCard";
import Pagination from "./Pagination";
import { ScanType } from "../../types/tiktokResult";
import { TikTokAccount } from "../../types/tiktok";
import VideoCard, { TikTokVideo } from "./VideoCard";

type Props = {
  scanType: ScanType | null;
  results: any[];
  limit: number;
};

export default function ResultList({ scanType, results, limit }: Props) {
  const [page, setPage] = useState(1);

  // ✅ reset page khi đổi data hoặc scanType
  useEffect(() => {
    setPage(1);
  }, [results, scanType, limit]);

  // ✅ cắt data theo page + limit
  const pagedData = useMemo(() => {
    const start = (page - 1) * limit;
    return results.slice(start, start + limit);
  }, [results, page, limit]);

  if (!scanType || results.length === 0) {
    return <div style={{ opacity: 0.7 }}>Chưa có dữ liệu</div>;
  }

  return (
    <div className="result-list-root">
      {/* ===== SCROLL AREA (CHỈ LIST) ===== */}
      <div className="result-list-scroll">
        {(() => {
          switch (scanType) {
            case "search_users":
            case "relations":
              return (
                <>
                  {(pagedData as TikTokAccount[]).map((acc) => (
                    <AccountCard key={acc.username} data={acc} />
                  ))}
                </>
              );

            case "comments":
              return (
                <>
                  {pagedData.map((c: any, idx) => (
                    <div key={idx} className="account-card">
                      <div className="account-content">
                        <strong>{c.display_name}</strong>

                        <p style={{ margin: "6px 0", opacity: 0.9 }}>
                          {c.comment}
                        </p>

                        <div className="account-stats">
                          ❤️ {c.likes}
                          <span>{c.date}</span>
                        </div>

                        {c.profile_url && (
                          <a
                            className="profile-link"
                            href={c.profile_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Xem profile →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              );

            case "top-posts":
              return (
                <>
                  {(pagedData as TikTokVideo[]).map((video) => (
                    <VideoCard key={video.video_id} data={video} />
                  ))}
                </>
              );

            default:
              return <div>Không hỗ trợ kiểu dữ liệu này</div>;
          }
        })()}
      </div>

      {/* ===== PAGINATION (KHÔNG SCROLL) ===== */}
      <div className="result-list-pagination">
        <Pagination
          page={page}
          total={results.length}
          limit={limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}