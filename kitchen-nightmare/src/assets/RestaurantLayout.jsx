import Draggable from "react-draggable";
import { useRef, useState, useEffect } from "react";
import Button from "./Button.jsx";
import QrCodeRenderer from './QrCodeReader.jsx';
import { addTableApi } from "../api/tablesApi.jsx";
import {getTokenFromCookies} from "../api/loginApi.jsx";


const deleteTableApi = async (id) => {
    let token = getTokenFromCookies();
    const response = await fetch(`http://localhost:5077/api/Tables/${id}/remove`,
        { method: "PATCH", headers: {
            "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    );
    return response.ok;
};

function TableItem({ table, isSelected, onSelectTable, selectedTableId, onMove, onShowQr, onDeleteClick }) {
    const nodeRef = useRef(null);
    const [dragged, setDragged] = useState(false);

    return (
        <Draggable
            nodeRef={nodeRef}
            position={{ x: table.x, y: table.y }}
            cancel=".cancel-drag" // Elementy z tą klasą nie będą przesuwać stolika
            onStart={() => setDragged(false)}
            onDrag={() => setDragged(true)}
            onStop={(e, data) => {
                onMove(table.table_id, data.x, data.y);
                if (!dragged) {
                    onSelectTable(selectedTableId === table.table_id ? null : table.table_id);
                }
            }}
        >
            <div
                ref={nodeRef}
                className="table"
                style={{
                    position: "absolute",
                    border: isSelected ? "3px solid #f5a623" : "1px solid #333",
                    padding: "15px",
                    width: "140px",
                    minHeight: "110px",
                    cursor: "move",
                    color: "white",
                    borderRadius: "12px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "bold",
                    backgroundColor: isSelected ? "#4a3300" : "#1e293b",
                    boxShadow: isSelected ? "0 0 15px rgba(245, 166, 35, 0.4)" : "0 4px 6px rgba(0,0,0,0.3)",
                    transition: "border 0.2s, background-color 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    userSelect: "none"
                }}
            >
                {/* MAŁY CZERWONY GUZIK USUWANIA */}
                <button
                    className="cancel-drag"
                    onClick={(e) => {
                        e.stopPropagation(); // Blokuje zaznaczenie stolika pod spodem
                        onDeleteClick(table.table_id);
                    }}
                    style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        border: "none",
                        fontSize: "14px",
                        lineHeight: "1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        padding: 0
                    }}
                    title="Usuń stolik"
                >
                    &times;
                </button>

                <p style={{ margin: 0, fontSize: "18px", paddingTop: "5px" }}>Stolik {table.table_id}</p>

                <button
                    className="cancel-drag"
                    onClick={(e) => {
                        e.stopPropagation();
                        onShowQr(table.table_id);
                    }}
                    style={{
                        marginTop: "10px",
                        padding: "6px 10px",
                        cursor: "pointer",
                        backgroundColor: "#f5a623",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        color: "#000",
                        fontSize: "12px",
                        transition: "background-color 0.15s"
                    }}
                >
                    Pokaż QR
                </button>
            </div>
        </Draggable>
    );
}

function QrPanel({ tableId, onClose }) {
    const [qrCodeData, setQrCodeData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!tableId) return;

        setLoading(true);
        fetch(`http://localhost:5077/api/tables/${tableId}/qrcode`)
            .then(res => res.json())
            .then(data => {
                setQrCodeData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [tableId]);

    return (
        <div style={{
            position: "fixed",
            right: "20px",
            top: "100px",
            width: "250px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            textAlign: "center",
            zIndex: 1000,
            border: "2px solid #f5a623",
            color: "#333"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, fontSize: "16px" }}>Kod QR Stolika {tableId}</h3>
                <button
                    onClick={onClose}
                    style={{
                        border: "none",
                        background: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "#999",
                        lineHeight: "1"
                    }}
                >
                    &times;
                </button>
            </div>

            {loading ? (
                <p>Ładowanie kodu...</p>
            ) : qrCodeData ? (
                <QrCodeRenderer qrData={qrCodeData} />
            ) : (
                <p style={{ color: "red" }}>Błąd pobierania kodu</p>
            )}
            <p style={{ fontSize: "12px", marginTop: "10px", color: "#66px" }}>
                Zeskanuj, aby otworzyć menu
            </p>
        </div>
    );
}

function RestaurantLayout({ selectedTableId, onSelectTable }) {
    const [activeQrTableId, setActiveQrTableId] = useState(null);

    // Nowy stan: przechowuje ID stolika wybranego do usunięcia (w celu otwarcia modala)
    const [tableToDelete, setTableToDelete] = useState(null);

    const [tables, setTables] = useState(() => {
        const saved = localStorage.getItem("tables");
        return saved
            ? JSON.parse(saved)
            : [
                { table_id: 1, x: 0, y: 0 },
                { table_id: 2, x: 150, y: 0 },
                { table_id: 3, x: 300, y: 0 }
            ];
    });

    const updateTablePosition = (id, x, y) => {
        setTables(prev =>
            prev.map(t => t.table_id === id ? { ...t, x: x, y: y } : t)
        );
    };

    useEffect(() => {
        localStorage.setItem("tables", JSON.stringify(tables));
    }, [tables]);

    const addTable = async () => {
        const temporaryId = 0;
        const newTableData = { x: 0, y: 0 };

        try {
            const assignedId = await addTableApi(temporaryId, newTableData);

            setTables(prev => [
                ...prev,
                {
                    table_id: assignedId,
                    x: newTableData.x,
                    y: newTableData.y
                }
            ]);
        } catch (error) {
            console.error("Nie udało się dodać stolika w API:", error);
            alert("Błąd podczas tworzenia stolika na serwerze.");
        }
    };

    const handleConfirmDelete = async () => {
        if (!tableToDelete) return;

        try {
            const success = await deleteTableApi(tableToDelete);
            if (success) {
                setTables(prev => prev.filter(t => t.table_id !== tableToDelete));
                if (selectedTableId === tableToDelete) onSelectTable(null);
                if (activeQrTableId === tableToDelete) setActiveQrTableId(null);
            } else {
                alert("Błąd API podczas usuwania stolika.");
            }
        } catch (error) {
            console.error("Błąd sieci przy usuwaniu stolika:", error);
        } finally {
            setTableToDelete(null);
        }
    };

    return (
        <div style={{ position: "relative", height: "100vh", padding: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
                <Button
                    className="button-add-table"
                    buttonText="Dodaj stolik"
                    onClick={addTable}
                />
            </div>

            <div style={{ position: "relative", width: "100%", height: "80%" }}>
                {tables.map(table => (
                    <TableItem
                        key={table.table_id}
                        table={table}
                        isSelected={selectedTableId === table.table_id}
                        onSelectTable={onSelectTable}
                        selectedTableId={selectedTableId}
                        onMove={updateTablePosition}
                        onShowQr={(id) => setActiveQrTableId(id)}
                        onDeleteClick={(id) => setTableToDelete(id)} // Otwarcie modala usunięcia
                    />
                ))}
            </div>

            {activeQrTableId && (
                <QrPanel
                    tableId={activeQrTableId}
                    onClose={() => setActiveQrTableId(null)}
                />
            )}

            {/* MODALNE OKIENKO POTWIERDZENIA USUNIĘCIA STOLIKA */}
            {tableToDelete && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10000,
                    backdropFilter: "blur(4px)"
                }}>
                    <div style={{
                        backgroundColor: "#ffffff",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
                        textAlign: "center",
                        maxWidth: "380px",
                        width: "90%",
                        border: "2px solid #ef4444",
                        boxSizing: "border-box"
                    }}>
                        <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "18px", fontFamily: "Arial" }}>
                            Usunąć Stolik {tableToDelete}?
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 20px 0", fontFamily: "Arial" }}>
                            Czy na pewno chcesz bezpowrotnie usunąć ten stolik z systemu? Wszystkie powiązane konfiguracje zostaną utracone.
                        </p>

                        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                            <button
                                onClick={() => setTableToDelete(null)} // Anulowanie akcji
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "6px",
                                    backgroundColor: "#f8fafc",
                                    color: "#64748b",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "13px"
                                }}
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                style={{
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: "#ef4444",
                                    color: "#ffffff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "13px"
                                }}
                            >
                                Tak, usuń
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestaurantLayout;