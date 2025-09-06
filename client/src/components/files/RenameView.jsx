import { useFileSystem } from "@/context/FileContext"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function RenameView({ id, preName, type, setEditing }) {
    const [name, setName] = useState(preName)
    const { renameFile, renameDirectory } = useFileSystem()
    const inputRef = useRef(null)

    const handleRename = () => {
        if (name === preName) {
            setEditing(false)
            return
        }
        if (name.trim() === "") {
            toast.error("Name cannot be empty")
            return
        }

        if (type === "file") {
            renameFile(id, name)
        } else {
            renameDirectory(id, name)
        }
        setEditing(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleRename()
        } else if (e.key === "Escape") {
            setEditing(false)
        }
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return (
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-blue-500 bg-dark text-white focus:outline-none"
            ref={inputRef}
        />
    )
}

export default RenameView
