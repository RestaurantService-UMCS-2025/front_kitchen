import Button from './Button';
import { useState, useEffect } from 'react';
import { getAllOrders, setOrderStatus } from "../api/ordersApi.jsx";
import {getRandomColor} from "./ColorRandomizer.jsx";

let ordersCache = null;
import * as signalR from '@microsoft/signalr';

function Orders({ selectedTableId, onSelectTable,seenOrders,markAsSeen }) {
    const [orders, setOrders] = useState(ordersCache || []);
    const [orderColors, setOrderColors] = useState({});
    useEffect(() => {
        if (ordersCache) {
            markAsSeen(ordersCache.map(o => o.id));
            return;
        }
        getAllOrders()
            .then(json => {
                setOrders(json);
                ordersCache = json;
                markAsSeen(json.map(o => o.id));
            })
            .catch(error => console.error(error));
    }, []);
    useEffect(() => {
        if (orders.length > 0) {
            const colors = {};
            orders.forEach(order => {
                colors[order.id] = getRandomColor();
            });
            setOrderColors(colors);
        }
    }, [orders.length]);

    const removeOrder = (id) => {
        setOrderStatus(id, 2)
            .then(() => {
                setOrders(prev => {
                    const updated = prev.filter(o => o.id !== id);
                    ordersCache = updated;
                    return updated;
                });
                if (selectedTableId === id) onSelectTable(null);
            })
            .catch(err => console.error(err));
    };

    const refreshOrders = () => {
        ordersCache = null;
        getAllOrders()
            .then(json => {
                setOrders(json);
                ordersCache = json;
            })
            .catch(error => console.error(error));
    };
    useEffect(() => {
        const hubUrl = "http://localhost:5077/ordersHub";

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("Połączono z SignalR!");

                connection.on("NewOrder", () => {
                    console.log("Aktualizacja listy zamówień");
                    refreshOrders();
                });
            })
            .catch(err => console.error("Błąd połączenia z SignalR: ", err));

        return () => {
            if (connection) {
                connection.off("NewOrder");
                connection.stop();
            }
        };
    }, []);

    return (
        <div>
            <Button buttonText="Odśwież" className="button-refresh" onClick={refreshOrders}>Click</Button>
            <div className="order-wrapper">
            <div>
                {orders.map((order) => (
                    order.items && order.items.length > 0 ? (
                        <div
                            key={order.id}
                            className="order"
                            onClick={() => {
                                markAsSeen(order.id);
                                onSelectTable(selectedTableId === order.tableId ? null : order.tableId);
                            }}
                            style={{
                                fontFamily: "Helvetica",
                                fontWeight: "normal",
                                backgroundColor: selectedTableId === order.tableId ? "#ffe066" : orderColors[order.id],
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                            }}
                        >
                            {!seenOrders.has(order.id) && (
                                <div className="order-new-dot" />
                            )}
                            <p>Płatność: {order.billAmount} zł</p>

                            {order.items && order.items.length > 0 && (
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item.orderItemId} style={{display:"flex", justifyContent:"space-between",alignItems:"center",gap:"5px"}}>
                                            <span>{item.menuItemName}</span>
                                            <span>  x{item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Button
                                buttonText="Zamówienie zrobione"
                                className="button-order"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOrder(order.id);
                                }}
                            />
                        </div>
                    ) : null
                ))}
            </div>
        </div>
        </div>
    );
}

export default Orders;