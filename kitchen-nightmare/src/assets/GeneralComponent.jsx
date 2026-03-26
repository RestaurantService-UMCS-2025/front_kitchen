import { useState } from 'react';
import Orders from "./Orders.jsx";
import RestaurantLayout from "./RestaurantLayout.jsx";
import ProductList from "./ProductList.jsx";

function GeneralComponent() {
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="container">

            <div className="orders-column">
                <div className="tab-bar">
                    <button
                        className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Zamówienia
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Produkty
                    </button>
                </div>
                {activeTab === 'orders'
                    ? <Orders selectedTableId={selectedTableId} onSelectTable={setSelectedTableId} />
                    : <ProductList />
                }
            </div>
            <div className="layout-column">
                <RestaurantLayout selectedTableId={selectedTableId} onSelectTable={setSelectedTableId} />
            </div>
        </div>
    );
}

export default GeneralComponent;