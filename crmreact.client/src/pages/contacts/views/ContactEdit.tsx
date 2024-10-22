import { useState, useEffect, useContext } from 'react';
import { Contact } from '../models/Contact.tsx'
import { AccountsList } from '../../accounts/views/AccountsList.tsx';
import { PopupContext } from '../../../context/PopupContext.tsx';
export interface ContactEditProps {
    contact: Contact | undefined;
    afterUpdate: () => void;
}
export function ContactEdit(props: ContactEditProps) {
    const dispatch = useContext(PopupContext);
    const [Contact, setContact] = useState<Contact | undefined>(props.contact);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [account, setAccount] = useState<string>("");
    const [accountId, setAccountId] = useState<string>("");
    const [showAccountSelect, setShowAccountSelect] = useState<boolean>(false);
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

    const openPopupAccount = () => {
        dispatch({
            id: 1,
            type: 'add',
            content: (<AccountsList showEditing={true} accountSelected={(e) => { setAccountId(e.id); setAccount(e.name); setShowAccountSelect(!showAccountSelect); dispatch({ id:1, type:'remove'}) }} />)
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
                <button type="submit">{Contact?.id === undefined ? 'New' : 'Update'}</button>
            </form>
        </div>
    );

}
