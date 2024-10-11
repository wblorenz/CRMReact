import { ChangeEvent, useState, useEffect } from 'react';
import { Contact } from '../models/Contact.tsx'
export interface ContactEditProps {
    Contact: Contact | undefined;
    afterUpdate: () => void;
}
export function ContactEdit(props: ContactEditProps) {
    const [Contact, setContact] = useState<Contact | undefined>(props.Contact);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    useEffect(() => {
        if (props.Contact?.name !== undefined) {
            setContact(props.Contact);
            setName(props.Contact?.name);
            setEmail(props.Contact?.email);
            setTelephone(props.Contact?.telephone);
            setAccount(props.Contact?.account);
        } else {
            setName("");
            setEmail("");
            setTelephone("");
            setAccount("");
            setContact(undefined);
        }
    }, [props.Contact])
    const handleSubmit = () => {
        let method = 'post';
        if (Contact?.id !== undefined) {
            method = 'put';
        }
        fetch('api/Contact', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                Id: Contact?.id ?? "",
                Name: name,
                Email: email,
                Telephone: telephone,
                Account: account
            })
        }).then((e) => e.json()).then((e) => { setContact(e); props.afterUpdate(); });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>, set: (s: string) => void) => {
        set(event.target.value);
    };
    return (
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <label htmlFor="name">Name:</label>
            <input name="name" value={name} onChange={(e) => handleChange(e, setName)}></input>
            <label htmlFor="email">Email:</label>
            <input name="email" value={email} onChange={(e) => handleChange(e, setEmail)}></input>
            <label htmlFor="telephone">Telephone:</label>
            <input name="telephone" value={telephone} onChange={(e) => handleChange(e, setTelephone)}></input>
            <label htmlFor="account">Account:</label>
            <input name="account" value={account} onChange={(e) => handleChange(e, setAccount)}></input>
            <br/>
            <button type="submit">{Contact?.id === undefined ? 'New' : 'Update'}</button>
        </form>
    );

}
