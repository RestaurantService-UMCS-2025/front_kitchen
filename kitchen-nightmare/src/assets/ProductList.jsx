import {useEffect, useState} from 'react';

function ProductList() {
    const [products, setProducts] = useState([]);
    //const [products, setProducts] = useState([
    //     { id: 1, name: 'Dwa Bułki', checked: false },
    //     { id: 2, name: 'Mięso', checked: false },
    //     { id: 3, name: 'Sałata', checked: false },
    //     { id: 4, name: 'Japko', checked: false },
    //     { id: 5, name: 'Pomidor', checked: false },
    // ]);

    useEffect(() => {
        fetch('http://localhost:5077/api/Menu/all')
            .then(response => response.json())
            .then(json => {
                setProducts(json)
            })
            .catch(error => console.error(error))
    }, []);

    const toggleProduct = (id,available) => {
        fetch(`http://localhost:5077/api/Menu/available`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                mode: available
            })
        }).then(() => {
            setProducts(prev =>
                prev.map(p => p.id === id ? { ...p, available: !p.available } : p)
            );
        }).catch(error => console.error(error))
    };

    return (
        <div style={{ fontFamily: 'Helvetica', padding: '10px' }}>
            <h2>Lista produktów</h2>
            {products.map(product => (
                <div
                    key={product.id}
                    className={`product-item ${product.available ? 'checked' : ''}`}
                >
                    <input
                        type="checkbox"
                        checked={!product.available}
                        onChange={() => toggleProduct(product.id,!product.available)}
                        onClick={e => e.stopPropagation()}
                    />
                    {product.dishName}
                </div>
            ))}
        </div>
    );
}

export default ProductList;