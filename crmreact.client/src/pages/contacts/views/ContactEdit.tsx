import { useState, useEffect } from 'react';
import { Contact } from '../models/Contact.tsx'
import { AccountsList } from '../../accounts/views/AccountsList.tsx';
import { GetPopupContext } from '../../../components/molecules/Popup.tsx';
import { Lookup } from '../../../components/molecules/Lookup.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
export interface ContactEditProps {
    contact: Contact | undefined;
    afterUpdate: () => void;
}
export function ContactEdit(props: ContactEditProps) {
    const dispatch = GetPopupContext();
    const guid = crypto.randomUUID();    
    const [contact, setContact] = useState<Contact | undefined>(props.contact);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [accountId, setAccountId] = useState<string>("");
    const [showAccountSelect, setShowAccountSelect] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const message = GetQuickMessageContext();
    useEffect(() => {
        if (props.contact?.name !== undefined) {
            setContact(props.contact);
            setName(props.contact?.name);
            setEmail(props.contact?.email);
            setTelephone(props.contact?.telephone);
            setAccount(props.contact?.account);
            setAccountId(props.contact?.accountId ?? "");
        } else {
            setName("");
            setEmail("");
            setTelephone("");
            setAccount("");
            setAccountId("");
            setContact(undefined);
        }
    }, [props.contact])
    const handleSubmit = () => {
        setError('');
        let method = 'post';
        if (contact?.id !== undefined) {
            method = 'put';
        }
        fetch('api/Contact', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                Id: contact?.id ?? "",
                Name: name,
                Email: email,
                Telephone: telephone,
                AccountId: accountId
            })
        }).then((e) => {
            if (e.ok) {
                e.json().then((e) => { setContact(e); props.afterUpdate(); message('Contact Saved!'); });
            } else {
                message('Error on save');

                e.json().then((e) => { setError(e); });
            }
        });
    };
    return (
        <div>
            <form className="form-container" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                <div className="form-field">
                    <label>Name:</label>
                    <input name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div className="form-field">
                    <label>Email:</label>
                    <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className="form-field">
                    <label>Telephone:</label>
                    <input name="telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)}></input>
                </div>
                <Lookup title='Accounts' id={guid} value={account} label="Account:">
                    <AccountsList showEditing={false} accountSelected={(e) => { setAccountId(e.id); setAccount(e.name); setShowAccountSelect(!showAccountSelect); dispatch({ id: guid, type: 'remove' }) }} />
                </Lookup>
                {error != '' && <span className="error-message">{error}<br /></span>}
                <div className="form-actions">
                    <button type="submit">{contact?.id === undefined ? 'New' : 'Update'}</button>
                </div>
            </form>
        </div>
    );

}
