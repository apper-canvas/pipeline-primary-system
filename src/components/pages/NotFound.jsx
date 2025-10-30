import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <ApperIcon name="Home" size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;