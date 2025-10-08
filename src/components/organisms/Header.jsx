import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
const Header = ({ onAddClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);

const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/contacts", label: "Contacts", icon: "Users" },
    { path: "/pipeline", label: "Pipeline", icon: "GitBranch" },
    { path: "/deals", label: "Deals", icon: "DollarSign" },
    { path: "/activities", label: "Activities", icon: "Activity" },
  ];
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-lg">
              <ApperIcon name="GitBranch" className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                Pipeline Pro
              </span>
              <span className="text-xs text-secondary -mt-1">CRM</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-primary"
                      : "text-secondary hover:bg-gray-100"
                  }`
                }
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

{/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button onClick={onAddClick} size="sm">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Quick Add
            </Button>
            <Button onClick={logout} size="sm" variant="outline">
              <ApperIcon name="LogOut" size={16} className="mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-secondary hover:bg-gray-100"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 bg-white"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-primary"
                        : "text-secondary hover:bg-gray-100"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={20} />
                  {item.label}
                </NavLink>
              ))}
              <div className="pt-2">
                <Button
                  onClick={() => {
                    onAddClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Quick Add
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;