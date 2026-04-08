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
        console.log(`Token from login ${data.token}`)
        document.cookie = `token=${data.token}`;

        return true
    }

    return false
}
