import { useEffect, useState } from "react";
import "./App.css";

// const API_BASE = "http://localhost:3001/api";
// 
const API_BASE = "https://tool-map-crawl-be-1.onrender.com/api";

type Tab = "jobs" | "tasks" | "task-result";

// ===== EXPORT HELPERS =====
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function exportToTXT(task: any) {
  const lines = task.result.map((item: any, index: number) => {
    return [
      `${index + 1}. ${item.name}`,
      `Rating: ${item.rating ?? "-"} (${item.totalReviews ?? 0})`,
      `Address: ${item.address ?? "-"}`,
      `Phone: ${item.phone ?? "-"}`,
      `Website: ${item.website ?? "-"}`,
      `Maps: ${item.url}`,
      "--------------------------",
    ].join("\n");
  });

  downloadFile(
    lines.join("\n"),
    `crawl-${task.keyword}.txt`,
    "text/plain;charset=utf-8",
  );
}

function exportToCSV(task: any) {
  const headers = [
    "Name",
    "Rating",
    "Total Reviews",
    "Address",
    "Phone",
    "Website",
    "Maps URL",
  ];

  const rows = task.result.map((item: any) => [
    `"${item.name ?? ""}"`,
    item.rating ?? "",
    item.totalReviews ?? "",
    `"${item.address ?? ""}"`,
    `"${item.phone ?? ""}"`,
    `"${item.website ?? ""}"`,
    `"${item.url ?? ""}"`,
  ]);

  const csv =
    headers.join(",") + "\n" + rows.map((r: any) => r.join(",")).join("\n");

  downloadFile(csv, `crawl-${task.keyword}.csv`, "text/csv;charset=utf-8");
}

export default function App() {
  // ===== FORM STATE =====
  const [keyword, setKeyword] = useState("");
  const [address, setAddress] = useState("");
  const [limit, setLimit] = useState(100);
  const [delay, setDelay] = useState(3);
  const [region, setRegion] = useState("vn");
  const [deepScan, setDeepScan] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ===== UI STATE =====
  const [tab, setTab] = useState<Tab>("jobs");

  const [jobs, setJobs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const [errors, setErrors] = useState<{
    keyword?: boolean;
    address?: boolean;
    limit?: boolean;
  }>({});

  // ===== API =====
  const fetchJobs = async () => {
    const res = await fetch(`${API_BASE}/crawl-jobs`);
    const json = await res.json();
    setJobs(json.data || []);
  };

  const fetchTasks = async (jobId: string) => {
    const res = await fetch(`${API_BASE}/crawl-tasks?jobId=${jobId}`);
    const json = await res.json();
    setTasks(json.data || []);
  };

  const fetchTaskDetail = async (taskId: string) => {
    const res = await fetch(`${API_BASE}/crawl-tasks/${taskId}`);
    const json = await res.json();

    setSelectedTask(json.data);
    setPage(1); // 👈 reset về trang 1
    setTab("task-result");
  };
  const createJob = async () => {
    const newErrors: any = {};

    if (!keyword.trim()) newErrors.keyword = true;
    if (!address.trim()) newErrors.address = true;
    if (!limit || limit <= 0) newErrors.limit = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc ⭐");
      return;
    }

    await fetch(`${API_BASE}/crawl-jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyword,
        address,
        limit,
        delay,
        region,
        deepScan,
      }),
    });

    setTab("jobs");
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  const results = selectedTask?.result || [];
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const pagedResults = results.slice((page - 1) * pageSize, page * pageSize);
  // ======================= UI =======================
  return (
    <div className="container">
      {/* LEFT */}
      <div className="left">
        <h2>Google Maps Crawler</h2>

        <label>
          Keyword (mỗi dòng 1 keyword) <span className="required">*</span>
        </label>
        <textarea
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="vd: mỹ phẩm&#10;trang phục truyền thống"
        />

        <label>
          Địa chỉ / Khu vực <span className="required">*</span>
        </label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="vd: Cầu Giấy, Hà Nội"
        />

        <label>
          Số lượng kết quả <span className="required">*</span>
        </label>
        <input
          type="number"
          value={limit}
          min={1}
          onChange={(e) => setLimit(Number(e.target.value))}
        />

        <label>Delay (giây)</label>
        <select
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        >
          <option value={1}>1 giây</option>
          <option value={3}>3 giây</option>
          <option value={5}>5 giây</option>
          <option value={10}>10 giây</option>
        </select>

        <label>Khu vực</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="vn">Việt Nam</option>
          <option value="global">Quốc tế</option>
        </select>

        <div className="switch-row">
          <span>Quét chi tiết</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={deepScan}
              onChange={() => setDeepScan(!deepScan)}
            />
            <span />
          </label>
        </div>

        <button className="run" onClick={createJob}>
          Bắt đầu quét
        </button>
      </div>

      {/* RIGHT */}
      <div className="right">
        {/* TAB HEADER */}
        <div className="tabs">
          <button
            className={tab === "jobs" ? "active" : ""}
            onClick={() => setTab("jobs")}
          >
            Quản lý Job
          </button>
          <button
            className={tab === "tasks" ? "active" : ""}
            onClick={() => setTab("tasks")}
            disabled={!selectedJobId}
          >
            Quản lý Task
          </button>
          {tab === "task-result" && <button className="active">Kết quả</button>}
        </div>

        {/* ===== JOBS ===== */}
        {tab === "jobs" && (
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Keyword</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id.slice(0, 8)}</td>
                  <td>{job.raw_keywords}</td>
                  <td>{job.status}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        fetchTasks(job.id);
                        setTab("tasks");
                      }}
                    >
                      Xem task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ===== TASKS ===== */}
        {tab === "tasks" && (
          <table>
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Keyword</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id.slice(0, 8)}</td>
                  <td>{task.keyword}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === "success" && (
                      <button onClick={() => fetchTaskDetail(task.id)}>
                        Xem kết quả
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ===== TASK RESULT ===== */}
        {tab === "task-result" && selectedTask && (
          <>
            <button onClick={() => setTab("tasks")}>⬅ Quay lại task</button>

            <h3>Kết quả: {selectedTask.keyword}</h3>

            <h3 style={{ display: "flex", alignItems: "center", gap: 12 }}>
              Kết quả: {selectedTask.keyword}
              <button onClick={() => exportToCSV(selectedTask)}>⬇ Excel</button>
              <button onClick={() => exportToTXT(selectedTask)}>⬇ TXT</button>
            </h3>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Rating (totalReviews)</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Website</th>
                  <th>Maps</th>
                </tr>
              </thead>
              <tbody>
                {/* {selectedTask.result?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      {item.rating ?? "-"} ({item.totalReviews})
                    </td>
                    <td>{item.address ?? "-"}</td>
                    <td>{item.phone ?? "-"}</td>
                    <td>
                      {item.website ? (
                        <a href={item.website} target="_blank">
                          Link
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <a href={item.url} target="_blank">
                        Maps
                      </a>
                    </td>
                  </tr>
                ))} */}
                {pagedResults.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{(page - 1) * pageSize + index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      {item.rating ?? "-"} ({item.totalReviews ?? "-"})
                    </td>
                    <td>{item.address ?? "-"}</td>
                    <td>{item.phone ?? "-"}</td>
                    <td>
                      {item.website ? (
                        <a href={item.website} target="_blank">
                          Link
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <a href={item.url} target="_blank">
                        Maps
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div className="page-info">
                Hiển thị {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, totalItems)} / {totalItems}
              </div>

              <div className="page-size">
                <span>Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="page-controls">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  ◀
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={page === i + 1 ? "active" : ""}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  ▶
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
