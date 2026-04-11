import {getTokenFromCookies} from "./loginApi.jsx";

const BASE_URL = 'http://localhost:5077/api/Orders';

export const getAllOrders = async () => {
    let token = getTokenFromCookies()
    console.log(token)
    const response = await fetch(`${BASE_URL}/orders`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Błąd pobierania produktów');
    }

    return await response.json();
};
export const setOrderStatus = async (id, stage) => {
    const response = await fetch(`${BASE_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stage: stage })
    });

    if (!response.ok) {
        throw new Error('Błąd zmiany statusu zamówienia');
    }

    return await response.text();
};