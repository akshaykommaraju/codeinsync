import { useEffect, useState } from "react"

export const useContextMenu = ({ ref }) => {
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const itemRef = ref.current
        if (!itemRef) return

        const handleRightClick = (e) => {
            if (ref.current && ref.current.contains(e.target)) {
                e.preventDefault()
                setMenuOpen(true)
                setCoords({
                    x: e.pageX,
                    y: e.pageY,
                })
            }
        }

        const handleItemContextMenu = (e) => {
            e.preventDefault()
            setMenuOpen(true)
            setCoords({
                x: e.pageX,
                y: e.pageY,
            })
        }

        const handleClick = () => {
            setMenuOpen(false)
        }

        const handleKeydown = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false)
            }
        }

        document.addEventListener("contextmenu", handleRightClick)
        if (ref.current) {
            ref.current.addEventListener("contextmenu", handleItemContextMenu)
        }
        document.addEventListener("click", handleClick)
        document.addEventListener("keydown", handleKeydown)

        return () => {
            document.removeEventListener("contextmenu", handleRightClick)
            if (ref.current) {
                ref.current.removeEventListener("contextmenu", handleItemContextMenu)
            }
            document.removeEventListener("click", handleClick)
            document.removeEventListener("keydown", handleKeydown)
        }
    }, [ref])

    return {
        menuOpen,
        setMenuOpen,
        coords,
        setCoords,
    }
}