import { useState } from 'react';
import Orders from "./Orders.jsx";
import RestaurantLayout from "./RestaurantLayout.jsx";
import ProductList from "./ProductList.jsx";

function GeneralComponent() {
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [activeTab, setActiveTab] = useState('orders');
    const [seenOrders, setSeenOrders] = useState(new Set());
    const [orderColors, setOrderColors] = useState({});


    const markAsSeen = (id) => {
        if (Array.isArray(id)) {
            setSeenOrders(prev => new Set([...prev, ...id]));
        } else {
            setSeenOrders(prev => new Set([...prev, id]));
        }
    };

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
                    ? <Orders
                        selectedTableId={selectedTableId}
                        onSelectTable={setSelectedTableId}
                        seenOrders={seenOrders}
                        markAsSeen={markAsSeen}
                        orderColors={orderColors}
                        setOrderColors={setOrderColors}
                    />
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