import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Sidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", icon: "📊", label: "Tableau de bord", exact: true },
    { path: "/profile", icon: "👤", label: "Mon profil" },
    { path: "/login", icon: "🔑", label: "S'inscrire / Se connecter" },
    { path: "/admin/users", icon: "👥", label: "Gérer les utilisateurs" },
    { path: "/admin/coaches", icon: "👨‍🏫", label: "Gérer les coachs" },
    { path: "/admin/activities", icon: "🏃‍♀️", label: "Gérer les activités" },
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? "w-14" : "w-64"} fixed sm:static h-full z-40 overflow-y-auto`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">CM</span>
              </div>
              <span className="text-lg font-bold text-gray-800">Admin</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-600">{isCollapsed ? "→" : "←"}</span>
          </button>
        </div>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 px-2 sm:px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              {item.path === "/admin/activities" ? (
                <button
                  onClick={() => navigate("/admin/activities", { replace: true })}
                  className={`flex items-center space-x-3 px-2 sm:px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path, item.exact) ? "bg-primary-500 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && <span className="font-medium text-sm sm:text-base">{item.label}</span>}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-2 sm:px-3 py-2 rounded-md transition-colors ${
                    isActive(item.path, item.exact) ? "bg-primary-500 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && <span className="font-medium text-sm sm:text-base">{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
