import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ticket } from '../models/Ticket.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
import { GetPopupContext } from '../../../components/molecules/Popup.tsx';
import { ContactsList } from '../../contacts/views/ContactsList.tsx';
import Moment from 'moment';
import moment from 'moment';
import { Lookup } from '../../../components/molecules/Lookup.tsx';

export interface TicketEditProps {
    ticket?: Ticket | undefined;
    afterUpdate?: () => void;
    onBack?: () => void;
}

export function TicketEdit(props: TicketEditProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | undefined>(props.ticket);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [solution, setSolution] = useState<string>("");
    const [date, setDate] = useState<string>('');
    const [contactId, setContactId] = useState<string>("");
    const [contact, setContact] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const message = GetQuickMessageContext();
    const guid = crypto.randomUUID();
    const dispatch = GetPopupContext();

    useEffect(() => {
        if (props.ticket) {
            setTicket(props.ticket);
            setTitle(props.ticket.title || "");
            setDescription(props.ticket.description ?? "");
            setSolution(props.ticket.solution ?? "");
            setContact(props.ticket.contact ?? "");
            setContactId(props.ticket.contactId ?? "");

            if (!Moment.isDate(props.ticket.date)) {
                setDate(moment(new Date()).format('YYYY-MM-DD'));
            } else {
                setDate(moment(props.ticket.date).format('YYYY-MM-DD'));
            }
            setIsLoading(false);
            setNotFound(false);
            return;
        }

        if (id) {
            if (id.toLowerCase() === 'new') {
                setTicket(new Ticket('', ''));
                setTitle("");
                setDescription("");
                setSolution("");
                setContact("");
                setContactId("");
                setDate(moment(new Date()).format('YYYY-MM-DD'));
                setIsLoading(false);
                setNotFound(false);
            } else {
                setIsLoading(true);
                setNotFound(false);
                setError("");
                fetch(`/api/Ticket/${id}`)
                    .then(async (res) => {
                        if (res.ok) {
                            const data: Ticket = await res.json();
                            setTicket(data);
                            setTitle(data.title || "");
                            setDescription(data.description ?? "");
                            setSolution(data.solution ?? "");
                            setContact(data.contact ?? "");
                            setContactId(data.contactId ?? "");
                            if (data.date) {
                                setDate(moment(data.date).format('YYYY-MM-DD'));
                            } else {
                                setDate(moment(new Date()).format('YYYY-MM-DD'));
                            }
                        } else {
                            setNotFound(true);
                        }
                    })
                    .catch((err) => {
                        console.error("Failed to fetch ticket", err);
                        setError("Failed to load ticket details.");
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        } else {
            setTitle("");
            setTicket(undefined);
            setDescription('');
            setSolution("");
            setContact("");
            setContactId("");
            setDate(moment(new Date()).format('YYYY-MM-DD'));
        }
    }, [props.ticket, id]);

    const handleBack = () => {
        if (props.onBack) {
            props.onBack();
        } else {
            navigate('/tickets');
        }
    };

    const handleSubmit = () => {
        setError("");
        setIsSaving(true);
        const method = ticket?.id ? 'put' : 'post';

        fetch('/api/Ticket', {
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
            .then(async (res) => {
                if (res.ok) {
                    const saved = await res.json();
                    setTicket(saved);
                    if (message) {
                        message('Ticket Saved successfully!');
                    }
                    if (props.afterUpdate) {
                        props.afterUpdate();
                    } else {
                        navigate('/tickets');
                    }
                } else {
                    const err = await res.json().catch(() => null);
                    setError(typeof err === 'string' ? err : err?.detail || 'Failed to save ticket');
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

    const isNew = !ticket?.id;

    if (isLoading) {
        return (
            <div className="empty-state">
                <div className="crm-spinner" style={{ margin: '0 auto 1rem auto' }} />
                <span>Loading ticket details...</span>
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
                        Back to Tickets
                    </button>
                </div>
                <div className="error-message">Ticket could not be found.</div>
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
                    Back to Tickets
                </button>
            </div>
            <div className="form-card">
                <div className="form-card-header">
                    <div>
                        <h3 style={{ margin: 0 }}>{isNew ? 'Create New Ticket' : 'Edit Ticket'}</h3>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {isNew ? 'Record a support ticket or issue for a client.' : (ticket?.title || title || 'Managing ticket details')}
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
        </div>
    );
}

export default TicketEdit;
