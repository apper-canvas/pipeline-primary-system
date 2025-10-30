import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
          <ApperIcon name="SearchX" className="w-12 h-12 text-blue-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Page Not Found
        </h2>
        
        <p className="text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button>
              <ApperIcon name="Home" size={16} className="mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link to="/contacts">
            <Button variant="secondary">
              <ApperIcon name="Users" size={16} className="mr-2" />
              View Contacts
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-secondary mt-8">
          Need help? Contact support or check your bookmarks.
        </p>
      </div>
    </div>
  );
};

export default NotFound;