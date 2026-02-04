import { useEffect, useState } from "react";
import "./App.css";

// const API_BASE = "http://localhost:3001/api";
//
const API_BASE = "https://tool-map-crawl-be-2.onrender.com/api";

type Tab = "jobs" | "tasks" | "task-result";
type SortOrder = "asc" | "desc";
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
    const s = item.socials || {};

    return [
      `${index + 1}. ${item.name}`,
      `Rating: ${item.rating ?? "-"} (${item.totalReviews ?? "-"})`,
      `Address: ${item.address ?? "-"}`,
      `Phone: ${item.phone ?? "-"}`,
      `Website: ${item.website ?? "-"}`,
      `Email: ${s.email ?? "-"}`,
      `Facebook: ${s.facebook ?? "-"}`,
      `Instagram: ${s.instagram ?? "-"}`,
      `LinkedIn: ${s.linkedin ?? "-"}`,
      `Twitter: ${s.twitter ?? "-"}`,
      `YouTube: ${s.youtube ?? "-"}`,
      `TikTok: ${s.tiktok ?? "-"}`,
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
    "Email",
    "Facebook",
    "Instagram",
    "LinkedIn",
    "Twitter",
    "YouTube",
    "TikTok",
    "Maps URL",
  ];

  const rows = task.result.map((item: any) => {
    const s = item.socials || {};

    return [
      `"${item.name ?? ""}"`,
      item.rating ?? "",
      item.totalReviews ?? "",
      `"${item.address ?? ""}"`,
      `"${item.phone ?? ""}"`,
      `"${item.website ?? ""}"`,
      `"${s.email ?? ""}"`,
      `"${s.facebook ?? ""}"`,
      `"${s.instagram ?? ""}"`,
      `"${s.linkedin ?? ""}"`,
      `"${s.twitter ?? ""}"`,
      `"${s.youtube ?? ""}"`,
      `"${s.tiktok ?? ""}"`,
      `"${item.url ?? ""}"`,
    ];
  });

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
  const [showSocials, setShowSocials] = useState(false);

  // ===== UI STATE =====
  const [tab, setTab] = useState<Tab>("jobs");

  const [jobs, setJobs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [errors, setErrors] = useState<{
    keyword?: boolean;
    address?: boolean;
    limit?: boolean;
  }>({});

  function getValue(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function sortData(data: any[]) {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const va = getValue(a, sortKey);
      const vb = getValue(b, sortKey);

      const ha = va !== null && va !== undefined && va !== "";
      const hb = vb !== null && vb !== undefined && vb !== "";

      // ❗ KHÔNG CÓ DATA = NHỎ NHẤT
      if (ha === hb) return 0;
      return sortOrder === "asc"
        ? ha
          ? 1
          : -1 // asc: không có lên trước
        : ha
          ? -1
          : 1; // desc: có lên trước
    });
  }
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

  // const pagedResults = results.slice((page - 1) * pageSize, page * pageSize);
  const sortedResults = sortData(results);

  const pagedResults = sortedResults.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function SortableTh({ label, field }: { label: string; field: string }) {
    return (
      <th
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (sortKey === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
          } else {
            setSortKey(field);
            setSortOrder("asc");
          }
        }}
      >
        {label}
        {sortKey === field && (sortOrder === "asc" ? " ▲" : " ▼")}
      </th>
    );
  }
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
          <div className="table-x-scroll">
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
          </div>
        )}

        {/* ===== TASKS ===== */}
        {tab === "tasks" && (
          <div className="table-x-scroll">
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
          </div>
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
              <button
                style={{ marginLeft: "auto" }}
                onClick={() => setShowSocials(!showSocials)}
              >
                {showSocials ? "Ẩn social ▲" : "Xem thêm social ▼"}
              </button>
            </h3>

            <div className="table-x-scroll">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <SortableTh label="Name" field="name" />
                    <SortableTh label="Rating" field="rating" />
                    <SortableTh label="Reviews" field="totalReviews" />
                    <SortableTh label="Address" field="address" />
                    <SortableTh label="Phone" field="phone" />
                    <SortableTh label="Website" field="website" />
                    {showSocials && (
                      <>
                        <SortableTh label="Email" field="socials.email" />
                        <SortableTh label="Facebook" field="socials.facebook" />
                        <SortableTh
                          label="Instagram"
                          field="socials.instagram"
                        />
                        <SortableTh label="LinkedIn" field="socials.linkedin" />
                        <SortableTh label="Twitter" field="socials.twitter" />
                        <SortableTh label="YouTube" field="socials.youtube" />
                        <SortableTh label="TikTok" field="socials.tiktok" />
                      </>
                    )}
                    <th>Maps</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedResults.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{(page - 1) * pageSize + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.rating ?? "-"}</td>
                      <td>{item.totalReviews ?? "-"}</td>
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

                      {showSocials && (
                        <>
                          <td>{item.socials?.email ?? "-"}</td>

                          <td>
                            {item.socials?.facebook ? (
                              <a href={item.socials.facebook} target="_blank">
                                FB
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {item.socials?.instagram ? (
                              <a href={item.socials.instagram} target="_blank">
                                IG
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {item.socials?.linkedin ? (
                              <a href={item.socials.linkedin} target="_blank">
                                IN
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {item.socials?.twitter ? (
                              <a href={item.socials.twitter} target="_blank">
                                TW
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {item.socials?.youtube ? (
                              <a href={item.socials.youtube} target="_blank">
                                YT
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {item.socials?.tiktok ? (
                              <a href={item.socials.tiktok} target="_blank">
                                TT
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </>
                      )}

                      <td>
                        <a href={item.url} target="_blank">
                          Maps
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
