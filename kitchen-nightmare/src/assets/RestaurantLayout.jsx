import Draggable from "react-draggable";
import { useRef, useState, useEffect } from "react";
import Button from "./Button.jsx";

function TableItem({ table, isSelected, onSelectTable, selectedTableId, onMove }) {
    const nodeRef = useRef(null);
    const [dragged, setDragged] = useState(false);

    return (
        <Draggable
            nodeRef={nodeRef}
            position={{ x: table.x, y: table.y }}
            onStart={() => setDragged(false)}
            onDrag={() => setDragged(true)}
            onStop={(e, data) => {
                onMove(table.table_id, data.x, data.y);

                if (!dragged) {
                    onSelectTable(
                        selectedTableId === table.table_id ? null : table.table_id
                    );
                }
            }}
        >
            <div
                ref={nodeRef}
                className="table"
                style={{
                    position: "absolute",
                    border: isSelected ? "3px solid #f5a623" : "1px solid black",
                    padding: "10px",
                    width: "130px",
                    cursor: "move",
                    color: "white",
                    fontSize: "25px",
                    fontFamily: "Helvetica",
                    fontWeight: "bold",
                    backgroundColor: isSelected ? "#5a3e00" : "",
                    transition: "border 0.2s, background-color 0.2s"
                }}
            >
                <p>Stolik {table.table_id}</p>
            </div>
        </Draggable>
    );
}

function RestaurantLayout({ selectedTableId, onSelectTable }) {

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
            prev.map(t =>
                t.table_id === id ? { ...t, x: x, y: y } : t
            )
        );
    };

    useEffect(() => {
        localStorage.setItem("tables", JSON.stringify(tables));
    }, [tables]);

    const addTable = () => {
        setTables(prev => [
            ...prev,
            {
                table_id:
                    prev.length > 0
                        ? Math.max(...prev.map(t => t.table_id)) + 1
                        : 1,
                x: 0,
                y: 0
            }
        ]);
    };

    return (
        <div style={{ position: "relative", height: "500px" }}>
            <Button className="button-add-table"
                    buttonText="Dodaj stolik"
                    onClick={addTable}>
            </Button>

            {tables.map(table => (
                <TableItem
                    key={table.table_id}
                    table={table}
                    isSelected={selectedTableId === table.table_id}
                    onSelectTable={onSelectTable}
                    selectedTableId={selectedTableId}
                    onMove={updateTablePosition}
                />
            ))}
        </div>
    );
}

export default RestaurantLayout;