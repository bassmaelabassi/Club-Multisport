import { createContext, useContext, useState } from "react"

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (notification) => {
    const id = Date.now()
    const newNotification = { ...notification, id }
    setNotifications((prev) => [...prev, newNotification])

    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const showSuccess = (message) => {
    addNotification({ type: "success", message })
  }

  const showError = (message) => {
    addNotification({ type: "error", message })
  }

  const showInfo = (message) => {
    addNotification({ type: "info", message })
  }

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
