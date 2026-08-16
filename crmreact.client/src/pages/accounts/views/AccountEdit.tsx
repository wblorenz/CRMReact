import { useState, useEffect } from 'react';
import { Account } from '../models/Account.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';

export interface AccountEditProps {
    account: Account | undefined;
    afterUpdate: () => void;
}

export function AccountEdit(props: AccountEditProps) {
    const [account, setAccount] = useState<Account | undefined>(props.account);
    const [name, setName] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const message = GetQuickMessageContext();

    useEffect(() => {
        if (props.account?.name !== undefined) {
            setAccount(props.account);
            setName(props.account?.name);
        } else {
            setName("");
            setAccount(undefined);
        }
    }, [props.account]);

    const handleSubmit = () => {
        setIsSaving(true);
        const method = account?.id !== undefined ? 'put' : 'post';
        
        fetch('api/Account', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Id: account?.id ?? "", Name: name })
        })
            .then((e) => e.json())
            .then((e) => {
                setAccount(e);
                props.afterUpdate();
                message('Account Saved successfully!');
            })
            .catch((err) => {
                console.error("Failed to save account", err);
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const isNew = account?.id === undefined;

    return (
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
    );
}
