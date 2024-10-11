import { ChangeEvent, useState, useEffect } from 'react';
import { Contact } from '../models/Contact.tsx'
export interface ContactEditProps {
    Contact: Contact | undefined;
    afterUpdate: () => void;
}
export function ContactEdit(props: ContactEditProps) {
    const [Contact, setContact] = useState<Contact | undefined>(props.Contact);
    const [name, setName] = useState<string>("");
    useEffect(() => {
        if (props.Contact?.name !== undefined) {
            setContact(props.Contact);
            setName(props.Contact?.name);
        } else {
            setName("");
            setContact(undefined);
        }
    },[props.Contact])
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
            }, body: JSON.stringify({ Id: Contact?.id ?? "", Name: name })
        }).then((e) => e.json()).then((e) => { setContact(e); props.afterUpdate(); });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName (event.target.value);
        if (Contact) {
            Contact.name = event.target.value;
        }
    };
    return (
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <input name="name" value={name} onChange={handleChange}></input>
            <button type="submit">{Contact?.id === undefined ? 'New' : 'Update'}</button>
        </form>
    );

}
