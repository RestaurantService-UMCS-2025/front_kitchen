import { useState } from 'react';
import Orders from "./Orders.jsx";
import RestaurantLayout from "./RestaurantLayout.jsx";

function GeneralComponent() {
    const [selectedTableId, setSelectedTableId] = useState(null);

    return (
        <div className="container">
            <div className="orders-column">
                <Orders
                    selectedTableId={selectedTableId}
                    onSelectTable={setSelectedTableId}
                />
            </div>
            <div className="layout-column">
                <RestaurantLayout
                    selectedTableId={selectedTableId}
                    onSelectTable={setSelectedTableId}
                />
            </div>
        </div>
    );
}

export default GeneralComponent;