export const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 60;
    const lightness = Math.floor(Math.random() * 20) + 25;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
document.documentElement.style.setProperty('--random-color', getRandomColor());
