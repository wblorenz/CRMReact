import { useState, useEffect } from 'react';
import { Ticket } from '../models/Ticket.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage';
import { TicketEdit } from './TicketEdit.tsx';

export interface TicketsListProps {
    showEditing: boolean;
}

export function TicketsList(props: TicketsListProps) {
    const [tickets, setTickets] = useState<Ticket[]>();
    const [filter, setFilter] = useState<string>('');
    const [ticketEditing, setTicketEditing] = useState<Ticket>();
    const message = GetQuickMessageContext();

    useEffect(() => {
        populateTickets('');
    }, []);

    async function populateTickets(fil?: string) {
        try {
            const response = await fetch(fil ? 'api/Ticket?filter=' + encodeURIComponent(fil) : 'api/Ticket');
            if (response.ok) {
                const data2 = await response.json();
                const data = data2.entities || [];
                for (let i = 0; i < data.length; i++) {
                    data[i].date = new Date(data[i].date);
                }
                setTickets(data);
            }
        } catch (err) {
            console.error("Failed to load tickets", err);
        }
    }

    function removeTicket(tick: Ticket) {
        if (confirm("Are you sure you want to delete the ticket: " + tick.title + "?")) {
            fetch('api/Ticket/' + tick.id, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Id: tick.id })
            })
                .then((res) => {
                    if (res.ok) {
                        populateTickets(filter);
                        message('Ticket Deleted!');
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
        populateTickets(filter);
    };

    if (ticketEditing) {
        return (
            <div>
                <div className="view-header">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setTicketEditing(undefined)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Tickets
                    </button>
                </div>
                <TicketEdit
                    ticket={ticketEditing}
                    afterUpdate={() => {
                        populateTickets(filter);
                        setTicketEditing(undefined);
                    }}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="view-header">
                <div>
                    <h2 className="view-title">Tickets</h2>
                </div>
                {props.showEditing && (
                    <button
                        type="button"
                        onClick={() => setTicketEditing(new Ticket('', ''))}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Ticket
                    </button>
                )}
            </div>

            <form onSubmit={handleFilterSubmit} className="view-toolbar">
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        name='filter'
                        value={filter}
                        placeholder='Search tickets by title, description...'
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <button type='submit' className="btn-secondary">Filter</button>
            </form>

            {tickets === undefined ? (
                <div className="empty-state">
                    <div className="crm-spinner" style={{ margin: '0 auto 1rem auto' }} />
                    <span>Loading tickets...</span>
                </div>
            ) : tickets.length === 0 ? (
                <div className="empty-state">
                    <p>No tickets found matching your criteria.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table" aria-labelledby="tableLabel">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Contact</th>
                                {props.showEditing && <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr
                                    key={ticket.id}
                                    onClick={() => {
                                        if (props.showEditing) {
                                            setTicketEditing(ticket);
                                        }
                                    }}
                                    className="recordList"
                                >
                                    <td><span className="record-badge">#{ticket.id}</span></td>
                                    <td style={{ fontWeight: 600 }}>{ticket.title}</td>
                                    <td style={{ color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {ticket.description || '—'}
                                    </td>
                                    <td>
                                        {ticket.contact ? (
                                            <span className="record-badge" style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)', borderColor: 'var(--primary-subtle-border)' }}>
                                                {ticket.contact}
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
                                                    removeTicket(ticket);
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

export default TicketsList;