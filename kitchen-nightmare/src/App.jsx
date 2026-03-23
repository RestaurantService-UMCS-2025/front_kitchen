import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GeneralComponent from "./assets/GeneralComponent.jsx";
import Login from "./assets/Login.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/app" element={<GeneralComponent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
