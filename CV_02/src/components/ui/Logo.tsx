import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <FileText className="h-7 w-7 text-primary-500" />
      <span className="text-xl font-bold">
        Shimmer<span className="text-primary-500">CV</span>
      </span>
    </Link>
  );
}

export default Logo;