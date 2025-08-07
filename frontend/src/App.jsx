import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import AppRouter from "./router"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
            <AppRouter />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
