import {useEffect, useState} from 'react';
import {getAllProducts, setProductAvailable} from "../api/productsApi.jsx";
//test branch merge
function ProductList() {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([
        { id: 1, name: 'Dwa Bułki', checked: false },
        { id: 2, name: 'Mięso', checked: false },
        { id: 3, name: 'Sałata', checked: false },
        { id: 4, name: 'Japko', checked: false },
        { id: 5, name: 'Pomidor', checked: false },
    ]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getAllProducts()
            .then(json => {
                setProducts(json)
            })
            .catch(error => console.error(error))
    }, []);

    const toggleProduct = (id,available) => {
        setProductAvailable(id,available)
        .then(() => {
            setProducts(prev =>
                prev.map(p => p.id === id ? { ...p, available: available } : p)
            );
        }).catch(error => console.error(error))
        console.log(products)
    };

    return (
        <div className="product-list-wrapper">
            <div className="product-list-header" onClick={() => setIsOpen(!isOpen)}>
                <h2>Lista produktów</h2>
                <span>{isOpen ? '▲' : '▼'}</span>

            </div>
            {isOpen && (
                <div className="product-list-body">
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => toggleProduct(product.id)}
                            className={`product-item ${product.checked ? 'checked' : ''}`}
                        >
                            <input
                                type="checkbox"
                                checked={product.checked}
                                onChange={() => toggleProduct(product.id)}
                                onClick={e => e.stopPropagation()}
                            />
                            {product.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductList;