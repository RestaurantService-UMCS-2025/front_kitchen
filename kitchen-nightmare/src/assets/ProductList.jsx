import { useState } from 'react';

function ProductList() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Dwa Bułki', checked: false },
        { id: 2, name: 'Mięso', checked: false },
        { id: 3, name: 'Sałata', checked: false },
        { id: 4, name: 'Japko', checked: false },
        { id: 5, name: 'Pomidor', checked: false },
    ]);

    const toggleProduct = (id) => {
        setProducts(prev =>
            prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p)
        );
    };

    return (
        <div style={{ fontFamily: 'Helvetica', padding: '10px' }}>
            <h2>Lista produktów</h2>
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
    );
}

export default ProductList;