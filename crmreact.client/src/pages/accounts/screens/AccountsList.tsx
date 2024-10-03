import { useState, useEffect } from 'react';
import { Account } from '../models/Account.tsx';
import { AccountEdit } from './AccountEdit.tsx';

export function AccountsList() {
    const [accounts, setAccounts] = useState<Account[]>();
    const [accountEditing, setAccountEditing] = useState<Account>();
    useEffect(() => {
        populateAccounts();
    }, []);
    const contents = accounts === undefined
        ? <p><em>Loading... </em></p>
        :
        <div>
            <div>
                <table className="table table-striped" aria-labelledby="tableLabel">

                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account =>
                            <tr key={account.id} onClick={() => setAccountEditing(account)} className="accountList">
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td className="exclude" onClick={(e) => { e.stopPropagation(); removeAccount(account) }}>Remove</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div><input type="button" value="New Account" onClick={() => { setAccountEditing(undefined) }} /></div>
            <div><AccountEdit account={accountEditing} accountName={accountEditing?.name ?? ""} afterUpdate={() => { populateAccounts(); }} /></div>
        </div>;

    return (
        <div>
            {contents}
        </div>
    );

    async function populateAccounts() {
        const response = await fetch('api/Account');
        const data = await response.json();
        setAccounts(data);
    };
    function removeAccount(acc: Account) {
        if (confirm("Delete the account? " + acc.name)) {
            fetch('api/Account/' + acc.id, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ Id: acc.id })
            }).then(() => populateAccounts());
        }
    };
}
