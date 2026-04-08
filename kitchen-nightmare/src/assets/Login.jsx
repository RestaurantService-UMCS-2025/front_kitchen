import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {login} from "../api/loginApi.jsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const success = await login(username, password);
        if (success) {
            navigate('/app')
        } else {
            setError('Nieprawidłowy login lub hasło');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Logowanie</h2>
                <input
                    className="login-input"
                    type="text"
                    placeholder="Login"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <input
                    className="login-input"
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                {error && <p className="login-error">{error}</p>}
                <button className="login-button" onClick={handleLogin}>
                    Zaloguj
                </button>
            </div>
        </div>
    );
}

export default Login;