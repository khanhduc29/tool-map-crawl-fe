import { useEffect, useMemo, useState } from "react";
import AccountCard from "./AccountCard";
import Pagination from "./Pagination";
import { ScanType } from "../../types/tiktokResult";
import { TikTokAccount } from "../../types/tiktok";

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

  switch (scanType) {
    case "search_users":
      return (
        <>
          {(pagedData as TikTokAccount[]).map((acc) => (
            <AccountCard key={acc.username} data={acc} />
          ))}

          {/* ✅ PHÂN TRANG Ở ĐÂY */}
          <Pagination
            page={page}
            total={results.length}
            limit={limit}
            onPageChange={setPage}
          />
        </>
      );

    case "relations":
      return <div>TODO: Render relations</div>;

    case "search_videos":
      return <div>TODO: Render videos</div>;

    default:
      return <div>Không hỗ trợ kiểu dữ liệu này</div>;
  }
}
