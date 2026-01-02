import { useRef } from 'react'; // 1. Importuj useRef
import Button from "./Button.jsx";
import Draggable from 'react-draggable';

function RestaurantLayout() {
    const tables = [
        {table_id: 1},
        {table_id: 2},
        {table_id: 3}
    ];

    return (
        <div>
            {tables.map(table => {
                const nodeRef = useRef(null);

                return (
                    <Draggable
                        key={table.table_id}
                        nodeRef={nodeRef}

                    >
                        <div className="table" ref={nodeRef} style={{ border: '1px solid black', padding: '10px', width: '130px',
                            cursor: 'move', color: 'white', fontSize: '25px',fontFamily: 'Helvetica', fontWeight: 'bold' }} >
                            <p>Stolik {table.table_id}</p>
                            <Button buttonText="Pokaż zamówienia" className='button-table'/>
                        </div>
                    </Draggable>
                );
            })}
        </div>
    );
}

export default RestaurantLayout;