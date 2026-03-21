import Button from "./Button.jsx";
import Draggable from 'react-draggable';
import {useRef, useState} from 'react';


function TableItem({ table, isSelected, onSelectTable, selectedTableId }) {
    const nodeRef = useRef(null);
    const [dragged, setDragged] = useState(false);

    return (
        <Draggable
            nodeRef={nodeRef}
            onStart={() => setDragged(false)}
            onDrag={() => setDragged(true)}
            onStop={() => {
                if (!dragged) onSelectTable(selectedTableId === table.table_id ? null : table.table_id);
            }}
        >
            <div
                ref={nodeRef}
                className="table"
                style={{
                    border: isSelected ? '3px solid #f5a623' : '1px solid black',
                    padding: '10px',
                    width: '130px',
                    cursor: 'move',
                    color: 'white',
                    fontSize: '25px',
                    fontFamily: 'Helvetica',
                    fontWeight: 'bold',
                    backgroundColor: isSelected ? '#5a3e00' : '',
                    transition: 'border 0.2s, background-color 0.2s'
                }}
            >
                <p>Stolik {table.table_id}</p>
                <Button buttonText="Pokaż zamówienia" className='button-table' />
            </div>
        </Draggable>
    );
}

function RestaurantLayout({ selectedTableId, onSelectTable }) {
    const tables = [
        { table_id: 1 },
        { table_id: 2 },
        { table_id: 3 }
    ];

    return (
        <div>
            {tables.map(table => (
                <TableItem
                    key={table.table_id}
                    table={table}
                    isSelected={selectedTableId === table.table_id}
                    onSelectTable={onSelectTable}
                    selectedTableId={selectedTableId}
                />
            ))}
        </div>
    );
}

export default RestaurantLayout;