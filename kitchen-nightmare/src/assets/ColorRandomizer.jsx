let lastHue = null;

export const getRandomColor = () => {
    let hue;

    do {
        hue = Math.floor(Math.random() * 360);
    } while (lastHue !== null && Math.abs(hue - lastHue) < 25);

    lastHue = hue;

    const saturation = 40 + Math.random() * 20;
    const lightness = 40 + Math.random() * 12;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};