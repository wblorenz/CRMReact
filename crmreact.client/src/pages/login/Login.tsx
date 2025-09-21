import React, { useState } from 'react';


export interface LoginModel {
    isAuthenticated: boolean;
    user: string;
    isLoading: boolean;
}
export function Login(props: { setState: React.Dispatch<React.SetStateAction<LoginModel>> }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // TODO: Replace with actual authentication logic
        if (name === '' || password === '') {
            setError('Please enter both name and password.');
            return;
        }
        const response = await fetch('api/User/Login',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    name: name,
                    password: password
                })
            });
        if (response.status !== 200) {
            setError("Incorrect user name or password");
            return;
        }
        const data = await response.json();
        if (data && data.name) {
            props.setState({ isAuthenticated: true, user: data.name, isLoading: false });
        }
        else {
            setError("Incorrect user name or password");
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};