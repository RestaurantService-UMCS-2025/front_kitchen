import Button from './Button';
import { useState, useEffect } from 'react';

function Orders({ selectedTableId, onSelectTable }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5077/api/Orders/orders')
            .then(response => response.json())
            .then(json => {
                setOrders(json)
            })
            .catch(error => console.error(error));
    }, []);

    const removeOrder = (id) => {
        fetch(`http://localhost:5077/api/Orders/orders/${id}/status`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stage: 2 }) // 2 to jest Paid
        })
            .then(res => {
                if (!res.ok) throw new Error("Błąd przy aktualizacji statusu");
                setOrders(prev => prev.filter(o => o.id !== id));
                if (selectedTableId === id) onSelectTable(null);
            })
            .catch(err => console.error(err));
    };

    return (
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
                            fontWeight: "bold",
                            backgroundColor: selectedTableId === order.tableId ? "#ffe066" : "",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                        }}
                    >
                        <p>Płatność: {order.billAmount}</p>

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