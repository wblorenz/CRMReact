import { useState, useEffect } from 'react';
import { Account } from '../models/Account.tsx'
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
export interface AccountEditProps {
    account: Account | undefined;
    afterUpdate: () => void;
}
export function AccountEdit(props: AccountEditProps) {
    const [account, setAccount] = useState<Account | undefined>(props.account);
    const [name, setName] = useState<string>("");
    const message = GetQuickMessageContext();
    useEffect(() => {
        if (props.account?.name !== undefined) {
            setAccount(props.account);
            setName(props.account?.name);
        } else {
            setName("");
            setAccount(undefined);
        }
    }, [props.account])
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
        }).then((e) => e.json()).then((e) => { setAccount(e); props.afterUpdate(); message('Account Saved!'); });
    };

    return (
        <form className="form-container" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            <div className="form-field">
                <label>Name:</label>
                <input name="name" value={name} onChange={(e) => setName(e.target.value)}></input>
            </div>
            <div className="form-actions">
                <button type="submit">{account?.id === undefined ? 'New' : 'Update'}</button>
            </div>
        </form>
    );

}
