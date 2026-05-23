
import {getTokenFromCookies} from "./loginApi.jsx";

const BASE_URL = 'http://localhost:5077/api/Tables';

export const addTableApi = async (id, tableInfo) => {
    let token = getTokenFromCookies();
    const tableInfoString = JSON.stringify(tableInfo);

    const response = await fetch(`${BASE_URL}/new`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: id,
            tableInfo: tableInfoString,
        })
    });

    if (response.ok) {
        const assignedId = await response.json();
        return assignedId;
    }

    throw new Error("Serwer zwrócił błąd podczas dodawania stolika.");
};