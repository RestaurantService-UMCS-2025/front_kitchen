import Button from './Button';
import { useState } from 'react';

function Orders({ selectedTableId, onSelectTable }) {
    const [orders, setOrders] = useState([
        { table_id: 1, order_name: 'Borgir' },
        { table_id: 2, order_name: 'Borgir, Szpageta' },
        { table_id: 3, order_name: 'P1vk0' }
    ]);

    const removeOrder = (table_id) => {
        setOrders(prev => prev.filter(o => o.table_id !== table_id));
        if (selectedTableId === table_id) onSelectTable(null);
    };

    return (
        <div>
            {orders.map((order) => (
                <div
                    key={order.table_id}
                    className="order"
                    onClick={() => onSelectTable(selectedTableId === order.table_id ? null : order.table_id)}
                    style={{
                        fontFamily: 'Helvetica',
                        fontWeight: 'bold',
                        backgroundColor: selectedTableId === order.table_id ? '#ffe066' : '',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <p>{order.order_name}</p>
                    <p>{order.table_id}</p>
                    <Button
                        buttonText="Zamówienie zrobione"
                        className='button-order'
                        onClick={(e) => {
                            e.stopPropagation();
                            removeOrder(order.table_id);
                        }}
                    />
                    <Button buttonText="Pokaż stolik" className='button-order' />
                </div>
            ))}
        </div>
    );
}

export default Orders;