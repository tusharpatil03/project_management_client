import { JSX } from 'react';
import { Link } from 'react-router-dom';

interface PageNotFoundProps {
  notFoundMsg?: string;
}

const PageNotFound = ({
  notFoundMsg = "Oops! The page you're looking for doesn't exist.",
}: PageNotFoundProps): JSX.Element => {
  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container text-center py-5">
        <h1 className="display-1 text-danger mb-4">404</h1>
        <p className="lead text-muted mb-4">{notFoundMsg}</p>
        <Link
          to="/projects"
          className="btn btn-primary btn-lg px-4"
          aria-label="Go back to dashboard"
        >
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default PageNotFound;
