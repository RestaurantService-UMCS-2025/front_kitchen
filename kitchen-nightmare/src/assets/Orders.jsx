import Button from './Button';
import { useState, useEffect } from 'react';
import {getAllOrders, setOrderStatus} from "../api/ordersApi.jsx";

let ordersCache = null;
function Orders({ selectedTableId, onSelectTable }) {
    const [orders, setOrders] = useState(ordersCache || []);

    useEffect(() => {
        if (ordersCache) {
            return;
        }
        getAllOrders()
            .then(json => {
                setOrders(json)
                ordersCache = json
            })
            .catch(error => console.error(error));
    }, []);

    const removeOrder = (id) => {
        setOrderStatus(id, 2)
            .then(() => {
                const updated = prev => prev.filter(o => o.id !== id)
                ordersCache = updated
                setOrders(updated);
                if (selectedTableId === id) onSelectTable(null);
            })
            .catch(err => console.error(err));
    };

    const refreshOrders =() =>  {
        ordersCache = null

        getAllOrders()
            .then(json => {
                setOrders(json)
                ordersCache = json
            })
            .catch(error => console.error(error));
    }

    return (
        <div>
            <button
            onClick={refreshOrders}
            >Click</button>
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
                            backgroundColor: selectedTableId === order.tableId ? "#ffe066" : "",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                        }}
                    >
                        <p>Płatność: {order.billAmount} zł</p>

                        {order.items && order.items.length > 0 && (
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.orderItemId}>
                                        {item.menuItemName} x {item.quantity}
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
                        <Button buttonText="Pokaż stolik" className="button-order" />
                    </div>
                ) : null
            ))}
        </div>
    );
}

export default Orders;