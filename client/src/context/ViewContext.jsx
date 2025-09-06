import ChatsView from "@/components/sidebar/sidebar-views/ChatsView"
import CopilotView from "@/components/sidebar/sidebar-views/CopilotView"
import FilesView from "@/components/sidebar/sidebar-views/FilesView"
import RunView from "@/components/sidebar/sidebar-views/RunView"
import SettingsView from "@/components/sidebar/sidebar-views/SettingsView"
import UsersView from "@/components/sidebar/sidebar-views/UsersView"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { createContext, useContext, useState } from "react"
import { IoSettingsOutline } from "react-icons/io5"
import { LuFiles, LuSparkles } from "react-icons/lu"
import { PiChats, PiPlay, PiUsers } from "react-icons/pi"

const ViewContext = createContext(null)

export const useViews = () => {
    const context = useContext(ViewContext)
    if (!context) {
        throw new Error("useViews must be used within a ViewContextProvider")
    }
    return context
}

function ViewContextProvider({ children }) {
    const { isMobile } = useWindowDimensions()
    const [activeView, setActiveView] = useState("files")
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)
    const [viewComponents] = useState({
        ["files"]: <FilesView />,
        ["clients"]: <UsersView />,
        ["settings"]: <SettingsView />,
        ["copilot"]: <CopilotView />,
        ["chats"]: <ChatsView />,
        ["run"]: <RunView />,
    })
    const [viewIcons] = useState({
        ["files"]: <LuFiles size={28} />,
        ["clients"]: <PiUsers size={30} />,
        ["settings"]: <IoSettingsOutline size={28} />,
        ["chats"]: <PiChats size={30} />,
        ["copilot"]: <LuSparkles size={28} />,
        ["run"]: <PiPlay size={28} />,
    })

    return (
        <ViewContext.Provider
            value={{
                activeView,
                setActiveView,
                isSidebarOpen,
                setIsSidebarOpen,
                viewComponents,
                viewIcons,
            }}
        >
            {children}
        </ViewContext.Provider>
    )
}

export { ViewContextProvider }
export default ViewContext
