import {getTokenFromCookies} from "./loginApi.jsx";

const BASE_URL = 'http://20.100.201.238:8080/api/Orders';

export const getAllOrders = async () => {
    let token = getTokenFromCookies()
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
export const createOrder = async (tableId, items) => {
    const orderResponse = await fetch(`${BASE_URL}/order`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableId: tableId })
    });

    if (!orderResponse.ok) {
        throw new Error(`Błąd tworzenia zamówienia: ${orderResponse.status}`);
    }

    const responseData = await orderResponse.json();
    const actualOrderId = typeof responseData === 'object' ? responseData.id : responseData;

    const response = await fetch(`${BASE_URL}/items?orderId=${actualOrderId}`, {
        method: "POST",
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(items)
    });

    if (!response.ok) {
        throw new Error(`Błąd dodawania pozycji: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dodano pozycje do zamówienia:", data);
    return data;
}