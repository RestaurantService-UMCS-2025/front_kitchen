import {useEffect, useState} from 'react';
import {getAllProducts, setProductAvailable} from "../api/productsApi.jsx";
//test branch merge
function ProductList() {
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
        <div style={{ fontFamily: 'Helvetica', padding: '10px' }}>
            <h2>Lista produktów</h2>
            {products.map(product => (
                <div
                    key={product.id}
                    className={`product-item ${!product.available ? 'checked' : ''}`}
                >
                    <input
                        type="checkbox"
                        checked={product.available}
                        onChange={(e) => toggleProduct(product.id, e.target.checked)}
                    />
                    {product.dishName}
                </div>
            ))}
        </div>
    );
}

export default ProductList;