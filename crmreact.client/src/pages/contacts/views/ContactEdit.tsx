import { useState, useEffect, useContext } from 'react';
import { Contact } from '../models/Contact.tsx'
import { AccountsList } from '../../accounts/views/AccountsList.tsx';
import { PopupContext } from '../../../context/PopupContext.tsx';
import { QuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
export interface ContactEditProps {
    contact: Contact | undefined;
    afterUpdate: () => void;
}
export function ContactEdit(props: ContactEditProps) {
    const dispatch = useContext(PopupContext);
    const [contact, setContact] = useState<Contact | undefined>(props.contact);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [accountId, setAccountId] = useState<string>("");
    const [showAccountSelect, setShowAccountSelect] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const message = useContext(QuickMessageContext);
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
                e.json().then((e) => { setContact(e); props.afterUpdate(); if (message) { message('Contact Saved!'); } });
            } else {
                if (message) { message('Error on save'); }

                e.json().then((e) => { setError(e); });
            }
        });
    };

    const openPopupAccount = () => {
        dispatch({
            id: 1,
            type: 'add',
            title: 'Accounts',
            content: (<AccountsList showEditing={false} accountSelected={(e) => { setAccountId(e.id); setAccount(e.name); setShowAccountSelect(!showAccountSelect); dispatch({ id: 1, type: 'remove' }) }} />)
        });
        // props.addPopup(); 

    }
    return (
        <div>
            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                <label>Name:
                    <input name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                </label>
                <label>Email:
                    <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </label>
                <label>Telephone:
                    <input name="telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)}></input>
                </label>
                <label>Account:
                    <input name="account" value={account} readOnly></input>
                </label>
                <input type="hidden" name="account_id" value={accountId} readOnly></input>
                <button type="button" onClick={() => openPopupAccount()}>Select Account</button>
                <br />
                {error != '' && <span style={{ color: 'red' }}>{error}<br /></span>}
                <button type="submit">{contact?.id === undefined ? 'New' : 'Update'}</button>
            </form>
        </div>
    );

}
