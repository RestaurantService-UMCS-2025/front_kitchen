import Button from './Button';
function Orders() {
    const orders = [
        {table_id: 1, order_name: 'Borgir'},
        {table_id: 2, order_name: 'Borgir, Szpageta'},
        {table_id: 3, order_name: 'P1vk0'}
    ];


    return (<div>
            {orders.map((order) =>
                (<div className="order" key={order.table_id} style={{fontFamily: 'Helvetica', fontWeight: 'bold'}} >
                    <p>{order.order_name}</p>
                    <p>{order.table_id}</p>
                <Button buttonText="Zamówienie zrobione" className='button-order'/>
                <Button buttonText="Pokaż stolik" className='button-order'/>
                </div>))}
        </div>
    );
}
export default Orders;
