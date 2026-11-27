import { useState } from 'react';

import type { FormEvent } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';

import {
    Server,
    User,
    Lock,
    ShieldCheck
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';

import { ApiError } from '../api/client';

import '../styles/login.css';

export function LoginPage() {

    const {
        login,
        isAuthenticated,
        loading
    } = useAuth();

    const navigate = useNavigate();

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {

        event.preventDefault();

        setError('');
        setSubmitting(true);

        try {

            await login({
                username,
                password
            });

            navigate('/', { replace: true });

        } catch (exception) {

            if (
                exception instanceof ApiError &&
                exception.status === 401
            ) {
                setError('Invalid username or password');
            } else {
                setError('Could not connect to the server');
            }

        } finally {

            setSubmitting(false);
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <main className="login-page">

            <section className="login-card">

                <div className="login-heading">

                    <div className="login-logo">
                        <Server size={28} />
                    </div>

                    <h1>HOME-LAB</h1>

                    <p>
                        Access your personal home server
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="username">
                        Username
                    </label>

                    <div className="login-input">

                        <User size={18} />

                        <input
                            id="username"
                            value={username}
                            onChange={event =>
                                setUsername(event.target.value)
                            }
                            autoComplete="username"
                            required
                        />

                    </div>

                    <label htmlFor="password">
                        Password
                    </label>

                    <div className="login-input">

                        <Lock size={18} />

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={event =>
                                setPassword(event.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Signing in...'
                            : 'Sign in'}
                    </button>

                </form>

                <div className="login-footer">

                    <ShieldCheck size={16} />

                    <span>
                        Secure session authentication
                    </span>

                </div>

            </section>

        </main>
    );
}