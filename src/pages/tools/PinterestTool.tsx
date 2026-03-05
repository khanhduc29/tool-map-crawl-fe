import { useEffect, useState } from "react";
import "./PinterestTool.css";
import { FaSearch, FaFileExcel, FaFileCode, FaPlay, FaHistory } from "react-icons/fa";

interface Pin {
  title: string | null;
  description: string | null;
  creator: string | null;
  creator_link: string | null;
  image: string | null;
  pin_link: string | null;
  external_link: string | null;
}

interface ScanHistory {
  keyword: string;
  date: string;
  total: number;
}


const MOCK_DATA: Pin[] = [
  {
    "title": null,
    "description": "#Studio #Music #Production #Audio #Recording #Workspace #Sound #Creative #Desk #Gear",
    "creator": "TURANA",
    "creator_link": "https://www.pinterest.com/la_turana/",
    "image": "https://i.pinimg.com/originals/cf/68/fd/cf68fd3b16e346b220c9247959bf605a.jpg",
    "pin_link": "https://www.pinterest.com/pin/119556565105676518/",
    "external_link": null
  },
  {
    "title": "How to Choose the Right Photo Studio Rental in Paris for Your Creative Projects - fullSTEAMahead365",
    "description": "This guide will help you pick the proper studio for your needs.",
    "creator": "Bill Loguidice",
    "creator_link": "https://www.pinterest.com/billloguidice/",
    "image": "https://i.pinimg.com/originals/c9/bf/35/c9bf3517aa25faeabe5d14d1f883944a.jpg",
    "pin_link": "https://www.pinterest.com/pin/2814818512839847/",
    "external_link": "https://fullsteamahead365.com"
  },
  {
    "title": "Empty Stage Lighting Setup",
    "description": "Soft diffused light into the middle point of focus - though probably a warmer colour. Surroundings are dark.",
    "creator": "anon.",
    "creator_link": "https://www.pinterest.com/projectanon/",
    "image": "https://i.pinimg.com/originals/ee/53/dd/ee53ddddc8801eaa90470f5c25934df9.jpg",
    "pin_link": "https://www.pinterest.com/pin/7459155629110780/",
    "external_link": null
  },
  {
    "title": null,
    "description": "\u0424\u043e\u0442\u043e\u0441\u0442\u0443\u0434\u0438\u044f \u044d\u0441\u0442\u0435\u0442\u0438\u043a\u0430 \u0446\u0438\u043a\u043b\u043e\u0440\u0430\u043c\u0430",
    "creator": "mertin_ol",
    "creator_link": "https://www.pinterest.com/mertin_ol/",
    "image": "https://i.pinimg.com/originals/86/29/44/8629448c4c1ce26b48136435e494a702.jpg",
    "pin_link": "https://www.pinterest.com/pin/351912466477327/",
    "external_link": null
  },
  {
    "title": null,
    "description": "",
    "creator": "novard1",
    "creator_link": "https://www.pinterest.com/novard1/",
    "image": "https://i.pinimg.com/originals/4c/bc/7c/4cbc7c70ec76df186826ad302a470083.jpg",
    "pin_link": "https://www.pinterest.com/pin/46584177392763743/",
    "external_link": null
  },
  {
    "title": null,
    "description": "",
    "creator": "Studio 360\u00b0",
    "creator_link": "https://www.pinterest.com/lestudio360/",
    "image": "https://i.pinimg.com/originals/b3/30/15/b330159477855ef0444693099858a7fc.jpg",
    "pin_link": "https://www.pinterest.com/pin/14284923813430598/",
    "external_link": null
  },
  {
    "title": "10 Modern Home Studio Setups That Nail The Vibe",
    "description": null,
    "creator": null,
    "creator_link": null,
    "image": "https://i.pinimg.com/originals/00/c2/5d/00c25d12c2f39097afc3548de57d316e.jpg",
    "pin_link": "https://www.pinterest.com/pin/563018697144255/",
    "external_link": null
  },
  {
    "title": null,
    "description": null,
    "creator": null,
    "creator_link": null,
    "image": "https://i.pinimg.com/originals/9f/e6/c8/9fe6c8ea90cd8e4819efe2fb982b3d64.jpg",
    "pin_link": "https://www.pinterest.com/pin/4081455907680352/",
    "external_link": null
  },
  {
    "title": "Find a Firm: Search the Remodelista Architect & Designer Directory",
    "description": "A select list of architects, interior designers, landscape architects, and furniture/lighting designers committed to innovative and sustainable design.",
    "creator": "Remodelista",
    "creator_link": "https://www.pinterest.com/remodelista/",
    "image": "https://i.pinimg.com/originals/db/d8/23/dbd823174c55533e917e8cc52e3fe079.jpg",
    "pin_link": "https://www.pinterest.com/pin/28921622585859753/",
    "external_link": "https://remodelista.com"
  },
  {
    "title": "Cozy Studio Apartment Decor Ideas for a Homey Vibe",
    "description": "Turn your compact space into a cozy retreat with these adorable studio apartment decor ideas! Think plush throws, warm lighting, and creative storage hacks that add personality to your home.\u00a0...\u00a0more",
    "creator": "Decor Diaries Aesthetic",
    "creator_link": "https://www.pinterest.com/decor_diaries_aesthetic/",
    "image": "https://i.pinimg.com/originals/6f/ac/5d/6fac5d2027609cdba92ab5b05859a1f9.jpg",
    "pin_link": "https://www.pinterest.com/pin/492649954214081/",
    "external_link": "https://lifeandagri.com"
  }
]
export default function PinterestTool() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<ScanHistory[]>([]);

  useEffect(() => {
    setData(MOCK_DATA);
  }, []);

  const startScan = () => {
    if (!keyword.trim()) return;

    setLoading(true);

    setTimeout(() => {
      setData(MOCK_DATA);

      const newHistory = {
        keyword,
        date: new Date().toLocaleString(),
        total: MOCK_DATA.length,
      };

      setHistory((prev) => [newHistory, ...prev]);

      setLoading(false);
    }, 800);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "pinterest.json";
    a.click();
  };

  const downloadExcel = () => {
    const rows = [
      [
        "title",
        "description",
        "creator",
        "creator_link",
        "image",
        "pin_link",
        "external_link",
      ],
      ...data.map((p) => [
        p.title ?? "",
        p.description ?? "",
        p.creator ?? "",
        p.creator_link ?? "",
        p.image ?? "",
        p.pin_link ?? "",
        p.external_link ?? "",
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "pinterest.csv";
    link.click();
  };

  return (
    <div className="pinterest-tool">

      <h1>Pinterest Crawler</h1>

      <div className="pinterest-search">

        <input
          placeholder="Enter keyword (example: studio design)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button onClick={startScan} disabled={loading}>
          <FaPlay />
          {loading ? "Scanning..." : "Start Scan"}
        </button>

        <button
          className="history-btn"
          onClick={() => setHistoryOpen(true)}
        >
          <FaHistory />
        </button>

      </div>

      {data.length > 0 && (
        <div className="download-bar">
          <button onClick={downloadJSON}>
            <FaFileCode /> JSON
          </button>

          <button onClick={downloadExcel}>
            <FaFileExcel /> Excel
          </button>
        </div>
      )}

      {loading && <div className="loading">Scanning Pinterest...</div>}

      <div className="pinterest-grid">

        {data.map((item, index) => (
          <div className="pin-card" key={index}>

            {item.image && <img src={item.image} alt="" />}

            <div className="pin-content">

              <h3>{item.title || "Untitled Pin"}</h3>

              {item.creator && (
                <p className="creator">
                  by{" "}
                  <a href={item.creator_link || "#"} target="_blank">
                    {item.creator}
                  </a>
                </p>
              )}

              {item.description && item.description.length > 0 && (
                <p className="desc">
                  {item.description.slice(0, 120)}
                </p>
              )}

              <div className="pin-links">

                {item.pin_link && (
                  <a href={item.pin_link} target="_blank">
                    View Pin
                  </a>
                )}

                {item.external_link && (
                  <a href={item.external_link} target="_blank">
                    Visit Site
                  </a>
                )}

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* OVERLAY */}
      {historyOpen && (
        <div
          className="history-overlay"
          onClick={() => setHistoryOpen(false)}
        />
      )}

      {/* HISTORY PANEL */}

      <div className={`history-panel ${historyOpen ? "open" : ""}`}>

        <div className="history-header">

          <h3>Scan History</h3>

          <button
            className="close-btn"
            onClick={() => setHistoryOpen(false)}
          >
            ✕
          </button>

        </div>

        {history.length === 0 && (
          <p className="empty">No scans yet</p>
        )}

        {history.map((item, index) => (
          <div key={index} className="history-item">
            <div>
              <strong>{item.keyword}</strong>
              <p>{item.date}</p>
            </div>

            <span>{item.total} pins</span>
          </div>
        ))}

      </div>

    </div>
  );
}