import { useState, useEffect } from 'react';
import { Ticket } from '../models/Ticket.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
import { GetPopupContext } from '../../../components/molecules/Popup.tsx';
import { ContactsList } from '../../contacts/views/ContactsList.tsx';
import Moment from 'moment';
import moment from 'moment';
import { Lookup } from '../../../components/molecules/Lookup.tsx';

export interface TicketEditProps {
    ticket: Ticket | undefined;
    afterUpdate: () => void;
}

export function TicketEdit(props: TicketEditProps) {
    const [ticket, setTicket] = useState<Ticket | undefined>(props.ticket);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const [date, setDate] = useState<string>('');
    const [contactId, setContactId] = useState<string>("");
    const [contact, setContact] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const message = GetQuickMessageContext();
    const guid = crypto.randomUUID();
    const dispatch = GetPopupContext();

    useEffect(() => {
        if (props.ticket?.title !== undefined) {
            setTicket(props.ticket);
            setTitle(props.ticket?.title);
            setDescription(props.ticket?.description ?? "");
            setSolution(props.ticket?.solution ?? "");
            setContact(props.ticket?.contact ?? "");

            if (!Moment.isDate(props.ticket?.date)) {
                setDate(moment(new Date()).format('YYYY-MM-DD'));
            } else {
                setDate(moment(props.ticket?.date).format('YYYY-MM-DD'));
            }
        } else {
            setTitle("");
            setTicket(undefined);
            setDescription('');
            setSolution("");
            setContact("");
            setDate(moment(new Date()).format('YYYY-MM-DD'));
        }
    }, [props.ticket]);

    const handleSubmit = () => {
        setError("");
        setIsSaving(true);
        const method = ticket?.id !== undefined ? 'put' : 'post';

        fetch('api/Ticket', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: ticket?.id ?? "",
                Title: title,
                Description: description,
                Solution: solution,
                Date: date,
                ContactId: contactId
            })
        })
            .then((e) => {
                if (e.ok) {
                    e.json().then((res) => {
                        setTicket(res);
                        props.afterUpdate();
                        message('Ticket Saved successfully!');
                    });
                } else {
                    message('Error saving ticket');
                    e.json().then((err) => {
                        setError(typeof err === 'string' ? err : 'Failed to save ticket');
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to save ticket", err);
                setError("Network error occurred.");
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const isNew = ticket?.id === undefined;

    return (
        <div className="form-card">
            <div className="form-card-header">
                <div>
                    <h3 style={{ margin: 0 }}>{isNew ? 'Create New Ticket' : 'Edit Ticket'}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {isNew ? 'Record a support ticket or issue for a client.' : `Managing ticket #${ticket?.id}`}
                    </p>
                </div>
            </div>
            <form className="form-container" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                <div className="form-field">
                    <label htmlFor="ticket-title">Ticket Title</label>
                    <input
                        id="ticket-title"
                        name="title"
                        placeholder="e.g. Issue with login page"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={isSaving}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="ticket-date">Date</label>
                    <input
                        id="ticket-date"
                        type="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        disabled={isSaving}
                    />
                </div>

                <div className="form-field full-width">
                    <Lookup title='Select Associated Contact' id={guid} value={contact} label="Contact">
                        <ContactsList
                            showEditing={false}
                            contactSelected={(con) => {
                                setContactId(con.id);
                                setContact(con.name);
                                dispatch({ id: guid, type: 'remove' });
                            }}
                        />
                    </Lookup>
                </div>

                <div className="form-field full-width">
                    <label htmlFor="ticket-desc">Description</label>
                    <textarea
                        id="ticket-desc"
                        name="description"
                        rows={3}
                        placeholder="Detailed explanation of the issue or request..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSaving}
                    />
                </div>

                <div className="form-field full-width">
                    <label htmlFor="ticket-solution">Solution / Resolution</label>
                    <textarea
                        id="ticket-solution"
                        name="solution"
                        rows={3}
                        placeholder="Resolution steps or closing remarks (if resolved)..."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        disabled={isSaving}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button type="submit" disabled={isSaving}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {isSaving ? 'Saving...' : isNew ? 'Create Ticket' : 'Update Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
}
