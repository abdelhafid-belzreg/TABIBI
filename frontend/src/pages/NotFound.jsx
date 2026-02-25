import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import myImage from "../assets/images/404.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-body">
      <div className="text-center px-3">

        {/* Image */}
        <img
          src={myImage}
          alt="404 Not Found"
          className="img-fluid mb-4"
          style={{ maxWidth: 320 }}
        />

        {/* Text */}
        <h1 className="fw-bold mb-2">Page Not Found</h1>
        <p className="text-secondary mb-1">
          Oops! The page{" "}
          <code className="text-primary bg-primary bg-opacity-10 px-2 py-1 rounded">
            {location.pathname}
          </code>{" "}
          does not exist.
        </p>
        <p className="text-secondary small mb-4">
          It may have been moved, deleted, or you may have mistyped the URL.
        </p>

        {/* Actions */}
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link
            to="/"
            className="btn btn-primary d-inline-flex align-items-center gap-2"
          >
            <Home size={16} /> Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;