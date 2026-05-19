import { useState } from "react"

function useAuth() {
    const [user] = useState(() => {
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : null
    })

    const isAuthenticated = !!user

    const logout = () => {
        localStorage.removeItem("user")
        window.location.href = "/auth"
    }

    return { user, isAuthenticated, logout }
}

export default useAuth