import Button from './Button';
import { useState, useEffect } from 'react';
import { getAllOrders, setOrderStatus } from "../api/ordersApi.jsx";
import {getRandomColor} from "./ColorRandomizer.jsx";

let ordersCache = null;

function Orders({ selectedTableId, onSelectTable }) {
    const [orders, setOrders] = useState(ordersCache || []);
    const [orderColors, setOrderColors] = useState({});


    useEffect(() => {
        if (ordersCache) {
            return;
        }
        getAllOrders()
            .then(json => {
                setOrders(json);
                ordersCache = json;
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
                            onClick={() =>
                                onSelectTable(selectedTableId === order.tableId ? null : order.tableId)
                            }
                            style={{
                                fontFamily: "Helvetica",
                                fontWeight: "normal",
                                backgroundColor: selectedTableId === order.tableId ? "#ffe066" : orderColors[order.id],
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                            }}
                        >
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