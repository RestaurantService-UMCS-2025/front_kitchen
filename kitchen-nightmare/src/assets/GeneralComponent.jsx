import Orders from "./Orders.jsx";
import RestaurantLayout from "./RestaurantLayout.jsx";
import ProductList from "./ProductList.jsx";
import {useState} from "react";

function GeneralComponent() {
    const [selectedTableId, setSelectedTableId] = useState(null);

    return (
        <div className="container">


            <div className="orders-column">
                <Orders selectedTableId={selectedTableId} onSelectTable={setSelectedTableId} />
            </div>
            <div className="products-column">
                <ProductList />
            </div>
            <div className="layout-column">
                <RestaurantLayout selectedTableId={selectedTableId} onSelectTable={setSelectedTableId} />
            </div>
        </div>
    );
}
export default GeneralComponent;