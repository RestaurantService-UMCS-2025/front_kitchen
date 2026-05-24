import Button from './Button';
import { useState, useEffect } from 'react';
import { getAllOrders, setOrderStatus } from "../api/ordersApi.jsx";
import { getRandomColor } from "./ColorRandomizer.jsx";
import OrderCard from './OrderCard';
import AddOrderModal from './AddOrderModal';
import * as signalR from '@microsoft/signalr';

let ordersCache = null;

function Orders({ selectedTableId, onSelectTable, orderColors, setOrderColors }) {
    const [orders, setOrders] = useState(ordersCache || []);
    const [orderToComplete, setOrderToComplete] = useState(null);

    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);

    const [localSeenOrders, setLocalSeenOrders] = useState(() => {
        const saved = localStorage.getItem("seenOrders");
        if (saved) {
            try {
                const parsedArray = JSON.parse(saved);
                return new Set(parsedArray);
            } catch (e) {
                console.error("Błąd parsowania seenOrders z localStorage", e);
                return new Set();
            }
        }
        return new Set();
    });

    useEffect(() => {
        const arrayToSave = Array.from(localSeenOrders);
        localStorage.setItem("seenOrders", JSON.stringify(arrayToSave));
    }, [localSeenOrders]);

    const handleMarkAsSeen = (orderId) => {
        setLocalSeenOrders(prev => {
            if (prev.has(orderId)) return prev;
            const updated = new Set(prev);
            updated.add(orderId);
            return updated;
        });
    };

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
            setOrderColors(prevColors => {
                const updatedColors = { ...prevColors };
                orders.forEach(order => {
                    if (!updatedColors[order.id]) {
                        updatedColors[order.id] = getRandomColor();
                    }
                });
                return updatedColors;
            });
        }
    }, [orders, setOrderColors]);

    const handleConfirmComplete = () => {
        if (!orderToComplete) return;

        setOrderStatus(orderToComplete, 2)
            .then(() => {
                setOrders(prev => {
                    const updated = prev.filter(o => o.id !== orderToComplete);
                    ordersCache = updated;
                    return updated;
                });
                if (selectedTableId === orderToComplete) onSelectTable(null);
                setOrderToComplete(null);
            })
            .catch(err => {
                console.error(err);
                setOrderToComplete(null);
            });
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
        const hubUrl = "http://20.100.201.238:8080/ordersHub";

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

    const sortedOrders = [...orders].sort((a, b) => {
        const aSeen = localSeenOrders.has(a.id);
        const bSeen = localSeenOrders.has(b.id);

        if (!aSeen && bSeen) return -1;
        if (aSeen && !bSeen) return 1;

        return b.id - a.id;
    });

    return (
        <div style={{ position: "relative", minHeight: "100%" }}>
            <Button buttonText="Odśwież" className="button-refresh" onClick={refreshOrders}>Click</Button>

            <Button buttonText="Dodaj zamówienie"
                    className="button-refresh"
                    onClick={() => setIsAddOrderModalOpen(true)}>
            </Button>

            <div className="order-wrapper">
                <div>
                    {sortedOrders.map((order) => (
                        order.items && order.items.length > 0 ? (
                            <OrderCard
                                key={order.id}
                                order={order}
                                selectedTableId={selectedTableId}
                                onSelectTable={onSelectTable}
                                seenOrders={localSeenOrders}
                                markAsSeen={handleMarkAsSeen}
                                orderColors={orderColors}
                                removeOrder={(id) => setOrderToComplete(id)}
                            />
                        ) : null
                    ))}
                </div>
            </div>

            {orderToComplete && (
                <div
                    onClick={() => setOrderToComplete(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(15, 23, 42, 0.75)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10000,
                        backdropFilter: "blur(4px)"
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "relative",
                            backgroundColor: "#ffffff",
                            padding: "30px",
                            borderRadius: "15px",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                            textAlign: "center",
                            maxWidth: "400px",
                            width: "90%",
                            border: "2px solid #f5a623",
                            boxSizing: "border-box"
                        }}
                    >
                        <button
                            onClick={() => setOrderToComplete(null)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "15px",
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                color: "#94a3b8",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            ×
                        </button>
                        <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "20px", fontFamily: "Helvetica, Arial" }}>
                            Ukończyć zamówienie?
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 25px 0", fontFamily: "Helvetica, Arial" }}>
                            Czy na pewno chcesz oznaczyć zamówienie #{orderToComplete} jako zrealizowane? Tej operacji nie można cofnąć.
                        </p>

                        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                            <button
                                onClick={() => setOrderToComplete(null)}
                                style={{
                                    padding: "10px 20px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    backgroundColor: "#f8fafc",
                                    color: "#64748b",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    transition: "background-color 0.2s"
                                }}
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleConfirmComplete}
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#ef4444",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    transition: "background-color 0.2s"
                                }}
                            >
                                Tak, ukończ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddOrderModal
                isOpen={isAddOrderModalOpen}
                onClose={() => setIsAddOrderModalOpen(false)}
                onOrderCreated={refreshOrders}
            />
        </div>
    );
}

export default Orders;