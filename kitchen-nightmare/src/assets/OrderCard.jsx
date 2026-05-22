import React from 'react';
import Button from './Button';

function OrderCard({
                       order,
                       selectedTableId,
                       onSelectTable,
                       seenOrders,
                       markAsSeen,
                       orderColors,
                       removeOrder
                   }) {
    return (
        <div
            className="order"
            onClick={() => {
                markAsSeen(order.id);
                onSelectTable(selectedTableId === order.tableId ? null : order.tableId);
            }}
            style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "normal",
                backgroundColor: selectedTableId === order.tableId ? "#ffe066" : orderColors[order.id],
                cursor: "pointer",
                transition: "background-color 0.2s",
                padding: "16px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                position: "relative"
            }}
        >
            {!seenOrders.has(order.id) && (
                <div className="order-new-dot" />
            )}

            <p style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                paddingBottom: "8px",
                color: selectedTableId === order.tableId ? "#000" : "#fff"
            }}>
                Płatność: {order.billAmount} zł
            </p>

            <ul style={{
                listStyleType: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}>
                {order.items.map((item) => (
                    <li
                        key={item.orderItemId}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            color: selectedTableId === order.tableId ? "#000" : "#fff"
                        }}
                    >
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            width: "100%"
                        }}>
                            <span style={{
                                fontWeight: "600",
                                fontSize: "15px",
                                textAlign: "left",
                                paddingRight: "10px",
                                flex: 1
                            }}>
                                {item.menuItemName}
                            </span>
                            <span style={{
                                fontWeight: "bold",
                                fontSize: "15px",
                                whiteSpace: "nowrap"
                            }}>
                                x{item.quantity}
                            </span>
                        </div>

                        {item.note && item.note.trim() !== "" && (
                            <div style={{
                                textAlign: "left",
                                marginTop: "4px",
                                paddingLeft: "8px",
                                borderLeft: selectedTableId === order.tableId ? "3px solid #cc0000" : "3px solid #ffe066",
                                fontSize: "13px",
                                fontStyle: "italic",
                                opacity: 0.9
                            }}>
                                {/* Usunięto ikonę ostrzeżenia, wyświetlamy samą treść notatki */}
                                <span>{item.note}</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: "auto", paddingTop: "4px" }}>
                <Button
                    buttonText="Zamówienie zrobione"
                    className="button-order"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeOrder(order.id);
                    }}
                />
            </div>
        </div>
    );
}

export default OrderCard;