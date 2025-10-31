import { createContext, useCallback, useContext, useEffect, useMemo } from "react"
import { toast } from "react-hot-toast"
import { io } from "socket.io-client"
import { useAppContext } from "./AppContext"
import { SocketEvent } from "../types/socket"

const SocketContext = createContext(null)

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider")
    }
    return context
}

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const SocketProvider = ({ children }) => {
    const {
        users,
        setUsers,
        setStatus,
        setCurrentUser,
        drawingData,
        setDrawingData,
    } = useAppContext()
    const socket = useMemo(() => {
        const socketInstance = io(BACKEND_URL, {
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
            transports: ['websocket', 'polling'],
            upgrade: true,
            forceNew: true,
            path: '/socket.io/',
            query: {},
            extraHeaders: {}
        });

        // Connection status handlers
        const onConnect = () => {
            console.log('✅ Socket connected:', socketInstance.id);
            setStatus('connected');
        };

        const onDisconnect = (reason) => {
            console.log('❌ Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Reconnect manually
                socketInstance.connect();
            }
            setStatus('disconnected');
        };

        const onError = (error) => {
            console.error('❌ Socket error:', error);
            setStatus('error');
        };

        const onReconnectAttempt = (attemptNumber) => {
            console.log(`♻️ Reconnection attempt ${attemptNumber}`);
            setStatus('reconnecting');
        };

        const onReconnect = (attemptNumber) => {
            console.log(`✅ Reconnected after ${attemptNumber} attempts`);
            setStatus('reconnected');
        };

        const onReconnectError = (error) => {
            console.error('❌ Reconnection error:', error);
            setStatus('reconnect_error');
        };

        const onReconnectFailed = () => {
            console.error('❌ Reconnection failed');
            setStatus('reconnect_failed');
        };

        // Setup event listeners
        socketInstance.on('connect', onConnect);
        socketInstance.on('disconnect', onDisconnect);
        socketInstance.on('connect_error', onError);
        socketInstance.on('reconnect_attempt', onReconnectAttempt);
        socketInstance.on('reconnect', onReconnect);
        socketInstance.on('reconnect_error', onReconnectError);
        socketInstance.on('reconnect_failed', onReconnectFailed);

        // Cleanup function
        return () => {
            socketInstance.off('connect', onConnect);
            socketInstance.off('disconnect', onDisconnect);
            socketInstance.off('connect_error', onError);
            socketInstance.off('reconnect_attempt', onReconnectAttempt);
            socketInstance.off('reconnect', onReconnect);
            socketInstance.off('reconnect_error', onReconnectError);
            socketInstance.off('reconnect_failed', onReconnectFailed);
            socketInstance.close();
        };
    }, [setStatus]);

    const handleError = useCallback(
        (err) => {
            console.log("socket error", err)
            setStatus("connection_failed")
            toast.dismiss()
            toast.error("Failed to connect to the server")
        },
        [setStatus],
    )

    const handleUsernameExist = useCallback(() => {
        toast.dismiss()
        setStatus("initial")
        toast.error(
            "The username you chose already exists in the room. Please choose a different username.",
        )
    }, [setStatus])

    const handleJoiningAccept = useCallback(
        ({ user, users }) => {
            setCurrentUser(user)
            setUsers(users)
            toast.dismiss()
            setStatus("joined")

            if (users.length > 1) {
                toast.loading("Syncing data, please wait...")
            }
        },
        [setCurrentUser, setStatus, setUsers],
    )

    const handleUserLeft = useCallback(
        ({ user }) => {
            toast.success(`${user.username} left the room`)
            setUsers(users.filter((u) => u.username !== user.username))
        },
        [setUsers, users],
    )

    const handleRequestDrawing = useCallback(
        ({ socketId }) => {
            socket.emit("sync_drawing", { socketId, drawingData })
        },
        [drawingData, socket],
    )

    const handleDrawingSync = useCallback(
        ({ drawingData }) => {
            setDrawingData(drawingData)
        },
        [setDrawingData],
    )

    useEffect(() => {
        socket.on("connect_error", handleError)
        socket.on("connect_failed", handleError)
        socket.on(SocketEvent.USERNAME_EXISTS, handleUsernameExist)
        socket.on(SocketEvent.JOIN_ACCEPTED, handleJoiningAccept)
        socket.on(SocketEvent.USER_DISCONNECTED, handleUserLeft)
        socket.on(SocketEvent.REQUEST_DRAWING, handleRequestDrawing)
        socket.on(SocketEvent.SYNC_DRAWING, handleDrawingSync)

        return () => {
            socket.off("connect_error")
            socket.off("connect_failed")
            socket.off(SocketEvent.USERNAME_EXISTS)
            socket.off(SocketEvent.JOIN_ACCEPTED)
            socket.off(SocketEvent.USER_DISCONNECTED)
            socket.off(SocketEvent.REQUEST_DRAWING)
            socket.off(SocketEvent.SYNC_DRAWING)
        }
    }, [
        handleDrawingSync,
        handleError,
        handleJoiningAccept,
        handleRequestDrawing,
        handleUserLeft,
        handleUsernameExist,
        setUsers,
        socket,
    ])

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}

export { SocketProvider }
export default SocketContext
