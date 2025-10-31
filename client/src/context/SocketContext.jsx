import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useAppContext } from "./AppContext"
import { SocketEvent } from "../types/socket"
import socket, { socket as namedSocket } from "../socket"

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  error: null
})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

const SocketProvider = ({ children }) => {
  const {
    users,
    setUsers,
    setStatus,
    setCurrentUser,
    drawingData,
    setDrawingData,
  } = useAppContext()

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [error, setError] = useState(null)

  const handleError = useCallback((err) => {
    console.error("Socket error:", err)
    setError(err)
    setStatus("connection_failed")
    toast.dismiss()
    toast.error("Connection error. Trying to reconnect...")
  }, [setStatus])

  const handleUsernameExist = useCallback(() => {
    toast.dismiss()
    setStatus("initial")
    toast.error("The username you chose already exists in the room. Please choose a different username.")
  }, [setStatus])

  const handleJoiningAccept = useCallback(({ user, users }) => {
    setCurrentUser(user)
    setUsers(users)
    toast.dismiss()
    setStatus("joined")
    if (users.length > 1) {
      toast.loading("Syncing data, please wait...")
    }
  }, [setCurrentUser, setStatus, setUsers])

  const handleUserLeft = useCallback(({ user }) => {
    if (user) {
      toast.success(`${user.username} left the room`)
      setUsers(prevUsers => prevUsers.filter(u => u.username !== user.username))
    }
  }, [setUsers])

  const handleRequestDrawing = useCallback(({ socketId }) => {
    socket.emit("sync_drawing", { socketId, drawingData })
  }, [drawingData])

  const handleDrawingSync = useCallback(({ drawingData: newDrawingData }) => {
    if (newDrawingData) {
      setDrawingData(newDrawingData)
    }
  }, [setDrawingData])

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
      setError(null)
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', handleError)
    socket.on(SocketEvent.USERNAME_EXISTS, handleUsernameExist)
    socket.on(SocketEvent.JOIN_ACCEPTED, handleJoiningAccept)
    socket.on(SocketEvent.USER_DISCONNECTED, handleUserLeft)
    socket.on(SocketEvent.REQUEST_DRAWING, handleRequestDrawing)
    socket.on(SocketEvent.SYNC_DRAWING, handleDrawingSync)

    if (!socket.connected) {
      socket.connect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', handleError)
      socket.off(SocketEvent.USERNAME_EXISTS, handleUsernameExist)
      socket.off(SocketEvent.JOIN_ACCEPTED, handleJoiningAccept)
      socket.off(SocketEvent.USER_DISCONNECTED, handleUserLeft)
      socket.off(SocketEvent.REQUEST_DRAWING, handleRequestDrawing)
      socket.off(SocketEvent.SYNC_DRAWING, handleDrawingSync)
    }
  }, [
    handleError,
    handleUsernameExist,
    handleJoiningAccept,
    handleUserLeft,
    handleRequestDrawing,
    handleDrawingSync
  ])

  const contextValue = {
    socket,
    isConnected,
    error,
    reconnect: () => {
      if (socket.disconnected) {
        socket.connect()
      }
    }
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export { SocketProvider }
export default SocketContext
