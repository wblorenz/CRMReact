import { useState, useEffect } from 'react';
import { Contact } from '../models/Contact.tsx'
import { AccountsList } from '../../accounts/views/AccountsList.tsx';
export interface ContactEditProps {
    Contact: Contact | undefined;
    afterUpdate: () => void;
    addPopup: (element: JSX.Element) => void;
}
export function ContactEdit(props: ContactEditProps) {
    const [Contact, setContact] = useState<Contact | undefined>(props.Contact);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [accountId, setAccountId] = useState<string>("");
    const [showAccountSelect, setShowAccountSelect] = useState<boolean>(false);
    useEffect(() => {
        if (props.Contact?.name !== undefined) {
            setContact(props.Contact);
            setName(props.Contact?.name);
            setEmail(props.Contact?.email);
            setTelephone(props.Contact?.telephone);
            setAccount(props.Contact?.account);
            setAccountId(props.Contact?.accountId ?? "");
        } else {
            setName("");
            setEmail("");
            setTelephone("");
            setAccount("");
            setAccountId("");
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
                AccountId: accountId
            })
        }).then((e) => e.json()).then((e) => { setContact(e); props.afterUpdate(); });
    };

    const openPopupAccount = ()=>{
        props.addPopup((<AccountsList asLookup={true} accountSelected={(e) => { setAccountId(e.id); setAccount(e.name); setShowAccountSelect(!showAccountSelect); }} />)); 
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
                <button type="submit">{Contact?.id === undefined ? 'New' : 'Update'}</button>
            </form>
        </div>
    );

}
