const BASE_URL = process.env.REACT_APP_API_URL
export const apiRequest = async (endpoint, option = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`,
        {
            headers: { "Content-Type": "application/json", ...option.headers },
            ...option
        }
    )

    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null
    }

    return await response.json()
}