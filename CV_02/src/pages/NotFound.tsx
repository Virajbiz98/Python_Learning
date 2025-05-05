import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-6xl md:text-9xl font-bold text-gray-700">404</h1>
      <p className="mt-4 text-2xl font-semibold text-white">Page not found</p>
      <p className="mt-2 text-gray-400 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 btn btn-primary"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;