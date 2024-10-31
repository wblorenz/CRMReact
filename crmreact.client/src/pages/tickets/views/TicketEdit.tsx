import { useState, useEffect } from 'react';
import { Ticket } from '../models/Ticket.tsx'
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
    const [showContactSelect, setShowContactSelect] = useState<boolean>(false);
    const message = GetQuickMessageContext();
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
    }, [props.ticket])
    const handleSubmit = () => {
        setError("");
        let method = 'post';
        if (ticket?.id !== undefined) {
            method = 'put';
        }
        fetch('api/Ticket', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                Id: ticket?.id ?? "",
                Title: title,
                Description: description,
                Solution: solution,
                Date: date,
                ContactId: contactId
            })
        }).then((e) => {
            if (e.ok) {
                e.json().then((e) => {
                    setTicket(e);
                    props.afterUpdate();
                    message('Ticket Saved!');
                });
            } else {
                message('Error on save');
                e.json().then((e) => {
                    setError(e);
                });
            }
        });
    };
    return (
        <form className="form-container" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-field">
                <label>Title:</label>
                <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-field">
                <label>Description:</label>
                <input name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-field">
                <label>Solution:</label>
                <input name="solution" value={solution} onChange={(e) => setSolution(e.target.value)} />
            </div>
            <div className="form-field">
                <label>Date:</label>
                <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <Lookup title='Contact' id={1} value={contact} label="Contact:">
                <ContactsList showEditing={false} contactSelected={(e) => { setContactId(e.id); setContact(e.name); setShowContactSelect(!showContactSelect); dispatch({ id: 1, type: 'remove' }) }} />
            </Lookup>
            {error && (
                <span className="error-message">{error}</span>
            )}
            <div className="form-actions">
                <button type="submit">{ticket?.id === undefined ? 'New' : 'Update'}</button>
            </div>
        </form>

    );

}
