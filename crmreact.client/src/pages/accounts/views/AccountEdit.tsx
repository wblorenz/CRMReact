import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Account } from '../models/Account.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';

export interface AccountEditProps {
    account?: Account | undefined;
    afterUpdate?: () => void;
    onBack?: () => void;
}

export function AccountEdit(props: AccountEditProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [account, setAccount] = useState<Account | undefined>(props.account);
    const [name, setName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const message = GetQuickMessageContext();

    useEffect(() => {
        if (props.account) {
            setAccount(props.account);
            setName(props.account.name || "");
            setIsLoading(false);
            setNotFound(false);
            return;
        }

        if (id) {
            if (id.toLowerCase() === 'new') {
                setAccount(new Account());
                setName("");
                setIsLoading(false);
                setNotFound(false);
            } else {
                setIsLoading(true);
                setNotFound(false);
                setError("");
                fetch(`/api/Account/${id}`)
                    .then(async (res) => {
                        if (res.ok) {
                            const data: Account = await res.json();
                            setAccount(data);
                            setName(data.name || "");
                        } else {
                            setNotFound(true);
                        }
                    })
                    .catch((err) => {
                        console.error("Failed to fetch account", err);
                        setError("Failed to load account details.");
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        } else {
            setName("");
            setAccount(undefined);
        }
    }, [props.account, id]);

    const handleBack = () => {
        if (props.onBack) {
            props.onBack();
        } else {
            navigate('/accounts');
        }
    };

    const handleSubmit = () => {
        setError("");
        setIsSaving(true);
        const method = account?.id ? 'put' : 'post';
        
        fetch('/api/Account', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Id: account?.id ?? "", Name: name })
        })
            .then(async (res) => {
                if (res.ok) {
                    const savedAcc = await res.json();
                    setAccount(savedAcc);
                    if (message) {
                        message('Account Saved successfully!');
                    }
                    if (props.afterUpdate) {
                        props.afterUpdate();
                    } else {
                        navigate('/accounts');
                    }
                } else {
                    const err = await res.json().catch(() => null);
                    const msg = err?.detail || err?.title || 'Failed to save account.';
                    setError(msg);
                }
            })
            .catch((err) => {
                console.error("Failed to save account", err);
                setError("Network error occurred while saving.");
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const isNew = !account?.id;

    if (isLoading) {
        return (
            <div className="empty-state">
                <div className="crm-spinner" style={{ margin: '0 auto 1rem auto' }} />
                <span>Loading account details...</span>
            </div>
        );
    }

    if (notFound) {
        return (
            <div>
                <div className="view-header">
                    <button type="button" className="btn-secondary" onClick={handleBack}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Accounts
                    </button>
                </div>
                <div className="error-message">Account #{id} could not be found.</div>
            </div>
        );
    }

    return (
        <div>
            <div className="view-header">
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleBack}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Accounts
                </button>
            </div>
            <div className="form-card">
                <div className="form-card-header">
                    <div>
                        <h3 style={{ margin: 0 }}>{isNew ? 'Create New Account' : 'Edit Account'}</h3>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {isNew ? 'Fill in the information below to add a new account.' : `Managing details for account #${account?.id}`}
                        </p>
                    </div>
                </div>
                <form className="form-container" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <div className="form-field full-width">
                        <label htmlFor="account-name">Account Name</label>
                        <input
                            id="account-name"
                            name="name"
                            placeholder="e.g. Acme Corporation"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSaving}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-actions">
                        <button type="submit" disabled={isSaving}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {isSaving ? 'Saving...' : isNew ? 'Create Account' : 'Update Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AccountEdit;
