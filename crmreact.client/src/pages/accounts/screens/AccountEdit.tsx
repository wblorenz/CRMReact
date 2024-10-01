import { ChangeEvent, useState } from 'react';
import { Account } from '../models/Account.tsx'
export interface AccountEditProps {
    account: Account | undefined;
    afterUpdate: () => void;
}
export function AccountEdit(props: AccountEditProps) {
    let account = props.account ?? new Account();
    
    const [name, setName] = useState<string>(account?.name ?? "");
    const handleSubmit = () => {
        if (account === undefined) {
            return;
        }
        let method = 'post';
        if (account.id !== undefined) {
            method = 'put';
        }
        fetch('api/Account', {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ Id: account?.id ?? "", Name: name })
        }).then((e) => e.json()).then((e) => { account = e; props.afterUpdate(); });
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
            <button type="submit">Save</button>
        </form>
    );

}
