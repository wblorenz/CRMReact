import { useState, useEffect } from 'react';
import { Ticket } from '../models/Ticket.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage';
import { TicketEdit } from './TicketEdit.tsx';
export interface TicketsListProps {
    showEditing: boolean;
}
function TicketsList(props: TicketsListProps) {
    const [tickets, setTickets] = useState<Ticket[]>();
    const [filter, setFilter] = useState<string>('');
    const [ticketEditing, setTicketEditing] = useState<Ticket>();
    const message = GetQuickMessageContext();
    useEffect(() => {
        populateTickets('');
    }, []);
    const contents = tickets === undefined
        ? <p><em>Loading... </em></p>
        :
        <div>
            {props.showEditing && !ticketEditing && <div className="form-actions"> <button type="button" onClick={() => { setTicketEditing(new Ticket('', '')) }} >New Ticket</button></div>}
            {!ticketEditing && < div >
                <div className="form-actions">
                    <input name='filter' value={filter} onChange={(e) => setFilter(e.target.value)}></input>
                    <button type='button' onClick={() => populateTickets(filter)}>Filter</button>
                </div>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Contact</th>
                            {props.showEditing && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket =>
                            <tr key={ticket.id} onClick={() => {
                                if (props.showEditing) {
                                    setTicketEditing(ticket);
                                }
                            }
                            } className="recordList">
                                <td>{ticket.id}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.contact}</td>
                                {props.showEditing && <td className="exclude" onClick={(e) => { e.stopPropagation(); removeTicket(ticket) }}>Remove</td>}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>}
            {props.showEditing && ticketEditing && <div>
                <button type="button" value="Return" onClick={() => setTicketEditing(undefined)} >Return</button>
                <TicketEdit ticket={ticketEditing} afterUpdate={() => { populateTickets(''); }} /></div>}
        </div>;
    async function populateTickets(fil?: string) {
        const response = await fetch(fil ? 'api/Ticket?filter=' + fil : 'api/Ticket');
        const data2 = await response.json();
        const data = data2.entities;
        for (let i = 0; i < data.length; i++) {
            data[i].date = new Date(data[i].date);
        }
        setTickets(data);
    };

    function removeTicket(tick: Ticket) {
        if (confirm("Delete the ticket? " + tick.title)) {
            fetch('api/Ticket/' + tick.id, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ Id: tick.id })
            })
                .then((res) => {
                    if (res.ok) {
                        populateTickets('');
                        message('Ticket Deleted!');
                    } else {
                        res.json().then((json) => {
                            const { detail, instance } = json;
                            throw new Error(detail + " - " + instance);
                        })
                            .catch((error) => {
                                alert(error);
                            });
                    }
                })
        }
    };
    return (
        <div>
            {contents}
        </div>
    )
}

export default TicketsList;