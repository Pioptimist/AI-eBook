import { useState, useEffect } from "react";
import {Album} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { BASE_URL } from "../../utils/apiPaths";

const DashboardLayout = ({ children , noMainStyle = false}) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);


  const avatarUrl = user?.avatar?.startsWith('http')
        ? user.avatar
        : user?.avatar &&`${BASE_URL}/backend${user.avatar}`.replace(/\\/g, '/');

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
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 flex flex-col">
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center space-x-4">
                        <Link className="flex items-center space-x-3" to="/dashboard">
                            <div className="h-8 w-8 bg-gradient-to-br from-violet-400 to-violet-500 rounded-lg flex items-center justify-center">
                                <Album className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-black font-bold text-lg">AI eBook Creator</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <ProfileDropdown
                            isOpen={profileDropdownOpen}
                            onToggle={(e) => {
                                e.stopPropagation();   //this important to do cuz upar handleclickoutside ka system hai ab manle humne apne avatar pe click kiya aut setprfileki value change hui, useffect se woh uss click ko sunega aur handleclick chalu krke profile drop down close kr dega ie profile dropdown hoga hi nhi, so estop propagation bs yahi bolta hai ki yahi ruk jao iss event ko propogate mt kro aage
                                setProfileDropdownOpen(!profileDropdownOpen);
                            }}
                            avatar={avatarUrl ? avatarUrl : ""}
                            companyName={user?.name || ""}
                            email={user?.email || ""}
                            onLogout={logout}
                        />
                    </div>
                </header>
                <main className={noMainStyle ? "" : "flex-1 overflow-auto"}>
                    {children}
                </main>
            </div>
        </div>

    );
};

export default DashboardLayout;
