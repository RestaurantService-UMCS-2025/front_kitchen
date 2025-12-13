function Orders() {
    const orders = [
        {table_id: 1, order_name: 'Borgir'},
        {table_id: 2, order_name: 'Borgir, Szpageta'},
        {table_id: 3, order_name: 'P1vk0'}
    ];


    return (<div>
            {orders.map((order, index) =>
                (<div className="order">
                    <p>{order.order_name}</p>
                    <p>{order.table_id}</p>
                <button>Zamowienie zrobione</button>
                <button>Pokaż stolik</button></div>))}
        </div>
    );
}
export default Orders;
