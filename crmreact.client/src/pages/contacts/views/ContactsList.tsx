import { useState, useEffect } from 'react';
import { Contact } from '../models/Contact.tsx';
import { ContactEdit } from './ContactEdit.tsx';

export function ContactsList() {
    const [Contacts, setContacts] = useState<Contact[]>();
    const [ContactEditing, setContactEditing] = useState<Contact>();
    useEffect(() => {
        populateContacts();
    }, []);
    const contents = Contacts === undefined
        ? <p><em>Loading... </em></p>
        :
        <div>
            <div><input type="button" value="New Contact" onClick={() => { setContactEditing(new Contact()) }} /></div>
            <div>
                <table className="table table-striped" aria-labelledby="tableLabel">

                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Telephone</th>
                            <th>Account</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Contacts.map(Contact =>
                            <tr key={Contact.id} onClick={() => setContactEditing(Contact)} className="recordList">
                                <td>{Contact.id}</td>
                                <td>{Contact.name}</td>
                                <td>{Contact.email}</td>
                                <td>{Contact.telephone}</td>
                                <td>{Contact.account}</td>
                                <td className="exclude" onClick={(e) => { e.stopPropagation(); removeContact(Contact) }}>Remove</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {ContactEditing && <div> <ContactEdit Contact={ContactEditing} afterUpdate={() => { populateContacts(); }} /></div>}
        </div>;

    return (
        <div>
            {contents}
        </div>
    );

    async function populateContacts() {
        const response = await fetch('api/Contact');
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
            }).then(() => populateContacts());
        }
    };
}
