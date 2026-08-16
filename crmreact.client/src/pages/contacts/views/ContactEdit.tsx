import { useState, useEffect } from 'react';
import { Contact } from '../models/Contact.tsx';
import { AccountsList } from '../../accounts/views/AccountsList.tsx';
import { GetPopupContext } from '../../../components/molecules/Popup.tsx';
import { Lookup } from '../../../components/molecules/Lookup.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';

export interface ContactEditProps {
    contact: Contact | undefined;
    afterUpdate: () => void;
}

export function ContactEdit(props: ContactEditProps) {
    const dispatch = GetPopupContext();
    const guid = crypto.randomUUID();
    const [contact, setContact] = useState<Contact | undefined>(props.contact);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [accountId, setAccountId] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const message = GetQuickMessageContext();

    useEffect(() => {
        if (props.contact?.name !== undefined) {
            setContact(props.contact);
            setName(props.contact?.name);
            setEmail(props.contact?.email);
            setTelephone(props.contact?.telephone);
            setAccount(props.contact?.account);
            setAccountId(props.contact?.accountId ?? "");
        } else {
            setName("");
            setEmail("");
            setTelephone("");
            setAccount("");
            setAccountId("");
            setContact(undefined);
        }
    }, [props.contact]);

    const handleSubmit = () => {
        setError('');
        setIsSaving(true);
        const method = contact?.id !== undefined ? 'put' : 'post';

        fetch('api/Contact', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: contact?.id ?? "",
                Name: name,
                Email: email,
                Telephone: telephone,
                AccountId: accountId
            })
        })
            .then((e) => {
                if (e.ok) {
                    e.json().then((res) => {
                        setContact(res);
                        props.afterUpdate();
                        message('Contact Saved successfully!');
                    });
                } else {
                    message('Error saving contact');
                    e.json().then((err) => {
                        setError(typeof err === 'string' ? err : 'Failed to save contact');
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to save contact", err);
                setError("Network error occurred.");
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const isNew = contact?.id === undefined;

    return (
        <div className="form-card">
            <div className="form-card-header">
                <div>
                    <h3 style={{ margin: 0 }}>{isNew ? 'Create New Contact' : 'Edit Contact'}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {isNew ? 'Add a new person to your network and CRM.' : `Editing contact details for #${contact?.id}`}
                    </p>
                </div>
            </div>
            <form className="form-container" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                <div className="form-field">
                    <label htmlFor="contact-name">Full Name</label>
                    <input
                        id="contact-name"
                        name="name"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSaving}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="e.g. john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSaving}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="contact-phone">Telephone</label>
                    <input
                        id="contact-phone"
                        name="telephone"
                        placeholder="e.g. +1 (555) 000-0000"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        disabled={isSaving}
                    />
                </div>

                <Lookup title='Select Associated Account' id={guid} value={account} label="Associated Account">
                    <AccountsList
                        showEditing={false}
                        accountSelected={(acc) => {
                            setAccountId(acc.id);
                            setAccount(acc.name);
                            dispatch({ id: guid, type: 'remove' });
                        }}
                    />
                </Lookup>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button type="submit" disabled={isSaving}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {isSaving ? 'Saving...' : isNew ? 'Create Contact' : 'Update Contact'}
                    </button>
                </div>
            </form>
        </div>
    );
}
