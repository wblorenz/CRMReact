import { useState, useEffect, useContext } from 'react';
import { Contact } from '../models/Contact.tsx';
import { ContactEdit } from './ContactEdit.tsx';
import { QuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
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
    const contents = contacts === undefined
        ? <p><em>Loading... </em></p>
        :
        <div>
            {props.showEditing && !contactEditing && < div className="form-actions">
                <button type="button" onClick={() => { setContactEditing(new Contact()) }} >New Contact</button>
            </div>}
            {contactEditing === undefined && < div >
                <div className="form-actions">
                    <input name='filter' value={filter} onChange={(e) => setFilter(e.target.value)}></input>
                    <button type='button' onClick={() => populateContacts(filter)}>Filter</button>
                </div>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Telephone</th>
                            <th>Account</th>
                            {props.showEditing && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(Contact =>
                            <tr key={Contact.id} onClick={() => {
                                if (props.showEditing) {
                                    setContactEditing(Contact);
                                }
                                if (props.contactSelected) {
                                    props.contactSelected(Contact);
                                }
                            }
                            }>
                                <td>{Contact.id}</td>
                                <td>{Contact.name}</td>
                                <td>{Contact.email}</td>
                                <td>{Contact.telephone}</td>
                                <td>{Contact.account} </td>
                                {props.showEditing && <td className="exclude" onClick={(e) => { e.stopPropagation(); removeContact(Contact); }}>Remove</td>}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>}
            {contactEditing &&
                <div>
                    <button type='button' onClick={() => setContactEditing(undefined)}>Return</button>
                    <ContactEdit contact={contactEditing} afterUpdate={() => { populateContacts(filter); }} />
                </div>}
        </div>;

    return (
        <div>
            {contents}
        </div>
    );

    async function populateContacts(fil: string) {
        const response = await fetch(fil ? 'api/Contact?filter=' + fil : 'api/Contact');
        const data = await response.json();
        setContacts(data);
    };
    function removeContact(acc: Contact) {
        if (confirm("Delete the Contact? " + acc.name)) {
            fetch('api/Contact/' + acc.id, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ Id: acc.id })
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
                    })
                        .catch((error) => {
                            alert(error);
                        });
                }
            })
        }
    };
}
