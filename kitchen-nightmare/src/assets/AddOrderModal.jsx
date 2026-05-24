import { useState, useEffect } from 'react';
import { getAllProducts } from "../api/productsApi.jsx";
import { createOrder,  } from "../api/ordersApi.jsx";
import {getFreeTables} from "../api/tablesApi.jsx";

function AddOrderModal({ isOpen, onClose, onOrderCreated }) {
    const [availableProducts, setAvailableProducts] = useState([]);
    const [newOrderItems, setNewOrderItems] = useState([]);
    const [freeTables, setFreeTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState("");

    useEffect(() => {
        if (isOpen) {
            getAllProducts()
                .then(json => setAvailableProducts(json))
                .catch(err => console.error("Błąd podczas pobierania produktów: ", err));

            getFreeTables()
                .then(json => {
                    setFreeTables(json);
                    if (json && json.length > 0) {
                        setSelectedTableId(json[0].id);
                    }
                })
                .catch(err => console.error("Błąd podczas pobierania wolnych stolików: ", err));
        } else {
            setNewOrderItems([]);
            setAvailableProducts([]);
            setFreeTables([]);
            setSelectedTableId("");
        }
    }, [isOpen]);

    const handleUpdateQuantity = (product, delta) => {
        setNewOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.menuItemId === product.id);

            if (existingItem) {
                const updatedQuantity = existingItem.quantity + delta;

                if (updatedQuantity <= 0) {
                    return prevItems.filter(item => item.menuItemId !== product.id);
                }

                return prevItems.map(item =>
                    item.menuItemId === product.id ? { ...item, quantity: updatedQuantity } : item
                );
            }

            if (delta > 0) {
                return [...prevItems, {
                    orderItemId: 0,
                    menuItemId: product.id,
                    menuItemName: product.dishName,
                    quantity: 1,
                    unitPrice: product.price,
                    note: "",
                    status: 0
                }];
            }

            return prevItems;
        });
    };

    const handleConfirmAddOrder = () => {
        if (newOrderItems.length === 0) return;
        if (!selectedTableId) {
            alert("Proszę wybrać stolik!");
            return;
        }

        createOrder(Number(selectedTableId), newOrderItems)
            .then(() => {
                onOrderCreated();
                onClose();
            })
            .catch(err => {
                console.error("Błąd tworzenia zamówienia:", err);
            });
    };

    if (!isOpen) return null;

    const totalSelectedQuantity = newOrderItems.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10000,
                backdropFilter: "blur(8px)"
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    backgroundColor: "#111827",
                    padding: "30px",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    maxWidth: "500px",
                    width: "90%",
                    border: "2px solid #10b981",
                    boxSizing: "border-box",
                    fontFamily: "sans-serif"
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "12px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        color: "#9ca3af",
                        cursor: "pointer",
                        fontWeight: "normal",
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#ffffff"}
                    onMouseLeave={(e) => e.target.style.color = "#9ca3af"}
                >
                    ×
                </button>

                <h3 style={{
                    margin: "0 0 20px 0",
                    color: "#f3f4f6",
                    fontSize: "20px",
                    textAlign: "center",
                    fontWeight: "600"
                }}>
                    Dodaj nowe zamówienie
                </h3>

                <div style={{ marginBottom: "20px", textAlign: "left" }}>
                    <label style={{
                        display: "block",
                        color: "#9ca3af",
                        fontSize: "14px",
                        marginBottom: "8px",
                        fontWeight: "500"
                    }}>
                        Wybierz stolik:
                    </label>
                    <select
                        value={selectedTableId}
                        onChange={(e) => setSelectedTableId(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            backgroundColor: "#1f2937",
                            border: "1px solid #374151",
                            color: "#e5e7eb",
                            fontSize: "15px",
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        {freeTables.length === 0 ? (
                            <option value="" disabled>Brak wolnych stolików</option>
                        ) : (
                            freeTables.map(table => (
                                <option key={table.id} value={table.id}>
                                    Stolik {table.tableNumber || table.id}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="modal-scrollbar" style={{
                    maxHeight: "260px",
                    overflowY: "auto",
                    textAlign: "left",
                    marginBottom: "20px",
                    paddingRight: "8px"
                }}>
                    {availableProducts.length === 0 ? (
                        <p style={{ color: "#9ca3af", textAlign: "center", fontSize: "14px" }}>Ładowanie menu...</p>
                    ) : (
                        availableProducts.map(product => {
                            const currentItem = newOrderItems.find(item => item.menuItemId === product.id);
                            const quantity = currentItem ? currentItem.quantity : 0;

                            return (
                                <div key={product.id} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "14px 0",
                                    borderBottom: "1px solid #1f2937"
                                }}>
                                    <span style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "500" }}>
                                        {product.dishName} {product.price} zł
                                    </span>

                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <button
                                            onClick={() => handleUpdateQuantity(product, -1)}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "6px",
                                                border: "1px solid #374151",
                                                backgroundColor: quantity > 0 ? "#1f2937" : "#111827",
                                                cursor: quantity > 0 ? "pointer" : "not-allowed",
                                                color: quantity > 0 ? "#9ca3af" : "#4b5563",
                                                fontSize: "16px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                            disabled={quantity === 0}
                                        >
                                            -
                                        </button>

                                        <span style={{
                                            minWidth: "24px",
                                            textAlign: "center",
                                            fontWeight: "600",
                                            fontSize: "16px",
                                            color: quantity > 0 ? "#10b981" : "#9ca3af"
                                        }}>
                                            {quantity}
                                        </span>

                                        <button
                                            onClick={() => handleUpdateQuantity(product, 1)}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "6px",
                                                border: "1px solid #374151",
                                                backgroundColor: "#1f2937",
                                                cursor: "pointer",
                                                color: "#9ca3af",
                                                fontSize: "16px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div style={{
                    margin: "0 0 24px 0",
                    fontSize: "14px",
                    color: "#9ca3af",
                    textAlign: "right"
                }}>
                    Wybranych pozycji: <strong style={{ color: "#10b981", fontSize: "15px" }}>{totalSelectedQuantity}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 20px",
                            border: "1px solid #374151",
                            borderRadius: "6px",
                            backgroundColor: "#1f2937",
                            color: "#d1d5db",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleConfirmAddOrder}
                        disabled={newOrderItems.length === 0 || !selectedTableId}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "6px",
                            backgroundColor: (newOrderItems.length > 0 && selectedTableId) ? "#38bdf8" : "#1f2937",
                            color: (newOrderItems.length > 0 && selectedTableId) ? "#0f172a" : "#4b5563",
                            fontWeight: "600",
                            cursor: (newOrderItems.length > 0 && selectedTableId) ? "pointer" : "not-allowed",
                            fontSize: "14px",
                            transition: "background-color 0.2s"
                        }}
                    >
                        Dodaj zamówienie
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddOrderModal;