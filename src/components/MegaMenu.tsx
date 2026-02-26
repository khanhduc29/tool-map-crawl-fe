import { Link } from "react-router-dom";

type Props = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function MegaMenu({ onMouseEnter, onMouseLeave }: Props) {
  return (
    <div
      className="mega-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="menu-col">
        <h4>Google</h4>
        <Link to="/tools/google-maps">Cào Google Maps</Link>
        <a>Cào Google Search</a>
      </div>

      <div className="menu-col">
        <h4>Instagram</h4>
        <Link to="/tools/instagram">Cào Instagram</Link>
        <a>Check followers</a>
      </div>

      <div className="menu-col">
        <h4>TikTok</h4>
        <Link to="/tools/tiktok">Cào TikTok</Link>
        <a>Check tương tác</a>
      </div>
    </div>
  );
}