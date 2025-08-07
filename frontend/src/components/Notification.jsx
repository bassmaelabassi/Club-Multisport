
import { useEffect } from "react"
import { useNotification } from "../context/NotificationContext"

const Notification = () => {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} onRemove={removeNotification} />
      ))}
    </div>
  )
}

const NotificationItem = ({ notification, onRemove }) => {
  const getNotificationStyles = (type) => {
    const styles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
      warning: "bg-yellow-500 text-white",
    }
    return styles[type] || "bg-gray-500 text-white"
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification.id, onRemove])

  return (
    <div
      className={`${getNotificationStyles(notification.type)} px-4 py-3 rounded-md shadow-lg max-w-sm animate-slide-in`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm">{notification.message}</p>
        <button onClick={() => onRemove(notification.id)} className="ml-2 text-white hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  )
}

export default Notification
