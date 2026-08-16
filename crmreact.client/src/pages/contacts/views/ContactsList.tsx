import { useState, useEffect, useContext } from 'react';
import { Contact } from '../models/Contact.tsx';
import { ContactEdit } from './ContactEdit.tsx';
import { QuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
import { SearchInput } from '../../../components/molecules/SearchInput.tsx';

export interface ContactListProps {
    showEditing: boolean;
    contactSelected?: (con: Contact) => void;
}

export function ContactsList(props: ContactListProps) {
    const [contacts, setContacts] = useState<Contact[]>();
    const [filter, setFilter] = useState<string>('');
    const [contactEditing, setContactEditing] = useState<Contact>();
    const message = useContext(QuickMessageContext);

    useEffect(() => {
        populateContacts('');
    }, []);

    async function populateContacts(fil: string) {
        try {
            const response = await fetch(fil ? 'api/Contact?filter=' + encodeURIComponent(fil) : 'api/Contact');
            if (response.ok) {
                const data = await response.json();
                setContacts(data.entities || []);
            }
        } catch (err) {
            console.error("Failed to load contacts", err);
        }
    }

    function removeContact(acc: Contact) {
        if (confirm("Are you sure you want to delete the contact: " + acc.name + "?")) {
            fetch('api/Contact/' + acc.id, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Id: acc.id })
            }).then((res) => {
                if (res.ok) {
                    populateContacts(filter);
                    if (message) {
                        message('Contact Deleted!');
                    }
                } else {
                    res.json().then((json) => {
                        const { detail, instance } = json;
                        throw new Error(detail + " - " + instance);
                    }).catch((error) => {
                        alert(error);
                    });
                }
            });
        }
    }

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        populateContacts(filter);
    };

    if (contactEditing) {
        return (
            <div>
                <div className="view-header">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setContactEditing(undefined)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Contacts
                    </button>
                </div>
                <ContactEdit
                    contact={contactEditing}
                    afterUpdate={() => {
                        populateContacts(filter);
                        setContactEditing(undefined);
                    }}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="view-header">
                <div>
                    <h2 className="view-title">Contacts</h2>
                </div>
                {props.showEditing && (
                    <button
                        type="button"
                        onClick={() => setContactEditing(new Contact())}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Contact
                    </button>
                )}
            </div>

            <form onSubmit={handleFilterSubmit} className="view-toolbar">
                <SearchInput
                    name='filter'
                    value={filter}
                    placeholder='Search contacts by name, email...'
                    onChange={(e) => setFilter(e.target.value)}
                />
                <button type='submit' className="btn-secondary">Filter</button>
            </form>

            {contacts === undefined ? (
                <div className="empty-state">
                    <div className="crm-spinner" style={{ margin: '0 auto 1rem auto' }} />
                    <span>Loading contacts...</span>
                </div>
            ) : contacts.length === 0 ? (
                <div className="empty-state">
                    <p>No contacts found matching your criteria.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table" aria-labelledby="tableLabel">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Telephone</th>
                                <th>Account</th>
                                {props.showEditing && <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(contact => (
                                <tr
                                    key={contact.id}
                                    onClick={() => {
                                        if (props.showEditing) {
                                            setContactEditing(contact);
                                        }
                                        if (props.contactSelected) {
                                            props.contactSelected(contact);
                                        }
                                    }}
                                    className="recordList"
                                >
                                    <td><span className="record-badge">#{contact.id}</span></td>
                                    <td style={{ fontWeight: 600 }}>{contact.name}</td>
                                    <td>
                                        {contact.email ? (
                                            <a href={`mailto:${contact.email}`} onClick={e => e.stopPropagation()}>
                                                {contact.email}
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                                        )}
                                    </td>
                                    <td>{contact.telephone || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                                    <td>
                                        {contact.account ? (
                                            <span className="record-badge" style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', borderColor: 'var(--primary-subtle-border)' }}>
                                                {contact.account}
                                            </span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                                        )}
                                    </td>
                                    {props.showEditing && (
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                className="action-btn-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeContact(contact);
                                                }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
