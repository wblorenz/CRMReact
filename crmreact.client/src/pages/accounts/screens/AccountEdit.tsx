import { ChangeEvent, useState, useEffect } from 'react';
import { Account } from '../models/Account.tsx'
export interface AccountEditProps {
    account: Account | undefined;
    afterUpdate: () => void;
}
export function AccountEdit(props: AccountEditProps) {
    const [account, setAccount] = useState<Account | undefined>(props.account);
    const [name, setName] = useState<string>("");
    useEffect(() => {
        if (props.account?.name !== undefined) {
            setAccount(props.account);
            setName(props.account?.name);
        } else {
            setName("");
            setAccount(undefined);
        }
    },[props.account])
    const handleSubmit = () => { 
        let method = 'post';
        if (account?.id !== undefined) {
            method = 'put';
        }
        fetch('api/Account', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ Id: account?.id ?? "", Name: name })
        }).then((e) => e.json()).then((e) => { setAccount(e); props.afterUpdate(); });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName (event.target.value);
        if (account) {
            account.name = event.target.value;
        }
    };
    return (
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <input name="name" value={name} onChange={handleChange}></input>
            <button type="submit">{account?.id === undefined ? 'New' : 'Update'}</button>
        </form>
    );

}
