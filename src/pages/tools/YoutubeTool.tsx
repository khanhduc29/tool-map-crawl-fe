import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./YouTubeTool.css";

type TabType = "videos" | "channels" | "video_comments";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const tabs: { key: TabType; label: string }[] = [
  { key: "videos", label: "Top Video theo từ khóa" },
  { key: "channels", label: "Kênh theo từ khóa" },
  { key: "video_comments", label: "Quét bình luận video" },
];

export default function YouTubeTool() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = (tab as TabType) || "videos";

  const [keyword, setKeyword] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    const fetchPendingTask = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/youtube/task/pending`,
          {
            params: { scan_type: activeTab },
          },
        );

        if (res.data.success) {
          setTask(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingTask();
  }, [activeTab]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload =
        activeTab === "video_comments"
          ? {
              scan_type: activeTab,
              video_url: videoUrl,
              limit_comments: limit,
            }
          : {
              scan_type: activeTab,
              keyword,
              limit,
            };

      await axios.post(`${API_BASE_URL}/api/youtube/scan`, payload);
      alert("Tạo request thành công!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yt-page">
      <div className="yt-hero">
        <h1>YouTube Crawler</h1>
        <p>Quét dữ liệu YouTube theo từ khóa và phân tích tương tác</p>

        <div className="yt-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={activeTab === t.key ? "active" : ""}
              onClick={() => navigate(`/tools/youtube/${t.key}`)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="yt-content">
        <div className="yt-form-box">
          <h2>
            {activeTab === "videos" && "Quét top video theo từ khóa"}
            {activeTab === "channels" && "Quét kênh theo từ khóa"}
            {activeTab === "video_comments" && "Quét bình luận video"}
          </h2>

          {activeTab !== "video_comments" && (
            <input
              placeholder="Từ khóa (vd: marketing)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          )}

          {activeTab === "video_comments" && (
            <input
              placeholder="Link video YouTube"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          )}

          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang quét..." : "Quét dữ liệu"}
          </button>
        </div>

        <div className="yt-preview">
          {task ? (
            <div className="yt-card">
              <div className="thumbnail" />
              <div>
                <span className="tag">#{task.scan_type}</span>
                <p>Status: {task.status}</p>
                <p>Keyword: {task.input?.keyword || task.input?.video_url}</p>
                <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="yt-card">
              <p>Không có task pending</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
