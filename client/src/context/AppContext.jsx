import { createContext, useContext, useState } from "react"

const AppContext = createContext(null)

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === null) {
        throw new Error(
            "useAppContext must be used within a AppContextProvider",
        )
    }
    return context
}

function AppContextProvider({ children }) {
    const [users, setUsers] = useState([])
    const [status, setStatus] = useState(null)
    const [currentUser, setCurrentUser] = useState({
        username: "",
        roomId: "",
    })
    const [activityState, setActivityState] = useState(null)
    const [drawingData, setDrawingData] = useState(null)

    return (
        <AppContext.Provider
            value={{
                users,
                setUsers,
                currentUser,
                setCurrentUser,
                status,
                setStatus,
                activityState,
                setActivityState,
                drawingData,
                setDrawingData,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export { AppContextProvider }
export default AppContext
