import React, { useState } from 'react';
import styles from './Login.module.css';

export interface LoginModel {
    isAuthenticated: boolean;
    user: string;
    isLoading: boolean;
}

export function Login(props: { setState: React.Dispatch<React.SetStateAction<LoginModel>> }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (name.trim() === '' || password.trim() === '') {
            setError('Please enter both name and password.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/User/Login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    password: password
                })
            });

            if (response.status !== 200) {
                setError("Incorrect user name or password");
                setIsSubmitting(false);
                return;
            }

            const data = await response.json();
            if (data && data.name) {
                props.setState({ isAuthenticated: true, user: data.name, isLoading: false });
            } else {
                setError("Incorrect user name or password");
            }
        } catch (err) {
            console.error("Login request failed", err);
            setError("Failed to connect to authentication server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h2 className={styles.title}>Personal CRM</h2>
                    <p className={styles.subtitle}>Sign in to manage your relationships & tickets</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className="form-field">
                        <label htmlFor="name">Username</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="e.g. admin"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoComplete="username"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            disabled={isSubmitting}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className={`btn-primary ${styles.btnSubmit}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;