import React from 'react';

function QrCodeRenderer({ qrData }) {
    if (!qrData || !qrData.moduleMatrix) {
        return <p>Brak danych kodu QR</p>;
    }

    const matrix = qrData.moduleMatrix;
    const size = matrix.length;

    const cellSize = 10;
    const svgSize = size * cellSize;

    return (
        <div style={{ width: '250px', height: '250px', margin: '20px auto' }}>
            <svg
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                style={{ width: '100%', height: '100%', background: '#fff', padding: '10px', borderRadius: '4px' }}
            >
                {matrix.map((row, rowIndex) =>
                    row.map((isBlack, colIndex) => {
                        if (isBlack) {
                            return (
                                <rect
                                    key={`${rowIndex}-${colIndex}`}
                                    x={colIndex * cellSize}
                                    y={rowIndex * cellSize}
                                    width={cellSize}
                                    height={cellSize}
                                    fill="#000000"
                                />
                            );
                        }
                        return null;
                    })
                )}
            </svg>
        </div>
    );
}

export default QrCodeRenderer;