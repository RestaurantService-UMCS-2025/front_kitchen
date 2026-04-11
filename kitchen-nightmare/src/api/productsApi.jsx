import {getTokenFromCookies} from "./loginApi.jsx";

const BASE_URL = 'http://localhost:5077/api/Menu';

export const getAllProducts = async () => {
    const response = await fetch(`${BASE_URL}/all`);

    if (!response.ok) {
        throw new Error('Błąd pobierania produktów');
    }

    return await response.json();
};
export const setProductAvailable = async (id,available) => {
    const response = await fetch(`${BASE_URL}/available`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getTokenFromCookies()}`
        },
        body: JSON.stringify({
            id:id
            ,mode:available
            })
    });

    if(!response.ok){
        throw new Error('Błąd przy ustawianiu statusu produktu')
    }
    return true;
}