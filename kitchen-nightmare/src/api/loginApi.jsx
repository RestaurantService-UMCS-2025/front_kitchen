const BASE_URL = 'http://localhost:5077/api/Users';

export const login = async (login,password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login:login,
            password:password
        })
    });

    if(response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.token}`;

        return true
    }

    return false
}
export const getTokenFromCookies = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}