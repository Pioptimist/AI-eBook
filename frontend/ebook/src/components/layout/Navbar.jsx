import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { Menu, X, BookOpen, LogOut } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const avatarUrl = user?.avatar && user.avatar.startsWith('http')
          ? user.avatar
          : user?.avatar && `${BASE_URL}/backend${user.avatar}`.replace(/\\/g, '/');

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  return (
    <header>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <a href="/" className="flex items-center space-x-2.5 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900 tracking-tight">AI eBook Creator</span>
                </a>

                {/* desktop navigation */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-violet-600 rounded-lg hover:bg-violet-50/50 transition-all duration-200"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Auth Buttons & Profile */}
                <div className="hidden lg:flex items-center space-x-3">
                    {isAuthenticated ? (
                        <ProfileDropdown
                            isOpen={profileDropdownOpen}
                            onToggle={(e) => {
                                e.stopPropagation();
                                setProfileDropdownOpen(!profileDropdownOpen);
                            }}
                            avatar={avatarUrl ? avatarUrl : ""}
                            companyName={user?.name || ""}
                            email={user?.email || ""}
                            userRole={user?.role || ""}
                            onLogout={() => {console.log("logout");
                                logout();
                            }}
                        />
                    ) : (
                        <>
                            <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                Login
                            </a>
                            <a href="/signup" className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-700 hover:to-purple-700 rounded-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-200 hover:scale-105">
                                Get Started
                            </a>
                        </>
                    )}
                </div>

                {/* mobile menu button */}
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
                    {isOpen ? <X  className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                </button>
            </div>
        </div>

        {/* mobile menu */}
        {isOpen && (
        <div className="lg:hidden bg-white border-gray-200 animate-in slide-in-from-top duration-200">
                <nav className="px-4 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-violet-600 
                            hover:bg-violet-50/50 transition-all duration-200"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
                <div className="px-4 py-4 border-t border-gray-100">
                    {isAuthenticated ? (
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 px-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                                    <div className="text-xs text-gray-500">{user?.email}</div>
                                </div>
                            </div>
                            <button onClick={() => logout()} className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                                <LogOut className="h-5 w-5"/> Sign Out
                            </button>
                        </div>
                     ) : (
                        <div className="space-y-2">
                            <a href="/login" className="block text-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 
                            hover:bg-gray-50 rounded-lg transition-all duration-200">
                                Login
                            </a>
                            <a href="/signup" className="block text-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-200">
                                Get Started
                            </a>
                        </div>
                    )}
                </div>
            
        </div>
        )}
    </header>
  );
};

export default Navbar;