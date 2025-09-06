import { useEffect } from "react"
import { useSocket } from "../context/SocketContext"
import { SocketEvent } from "../types/socket"

const useUserActivity = () => {
    const { socket } = useSocket()

    useEffect(() => {
        const handleOnline = () => {
            socket.emit(SocketEvent.USER_ONLINE, { socketId: socket.id })
        }
        const handleOffline = () => {
            socket.emit(SocketEvent.USER_OFFLINE, { socketId: socket.id })
        }

        document.addEventListener(
            "visibilitychange",
            () => {
                if (document.visibilityState === "visible")
                    handleOnline()
                else if (document.visibilityState === "hidden")
                    handleOffline()
            },
        )

        return () => {
            document.removeEventListener(
                "visibilitychange",
                () => {
                    if (document.visibilityState === "visible")
                        handleOnline()
                    else if (document.visibilityState === "hidden")
                        handleOffline()
                },
            )
        }
    }, [socket])
}

export default useUserActivity
