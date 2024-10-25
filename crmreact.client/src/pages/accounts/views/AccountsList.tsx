import { useState, useEffect, useContext } from 'react';
import { Account } from '../models/Account.tsx';
import { AccountEdit } from './AccountEdit.tsx';
import { QuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
export interface AccountListProps {
    disableEditing: boolean;
    accountSelected?: (acc: Account) => void;
}
export function AccountsList(props: AccountListProps) {
    const [accounts, setAccounts] = useState<Account[]>();
    const [filter, setFilter] = useState<string>('');
    const [accountEditing, setAccountEditing] = useState<Account>();
    const message = useContext(QuickMessageContext);
    useEffect(() => {
        populateAccounts('');
    }, []);
    const contents = accounts === undefined
        ? <p><em>Loading... </em></p>
        :
        <div>
            {!props.disableEditing && !accountEditing && < div > <input type="button" value="New Account" onClick={() => { setAccountEditing(new Account()) }} /></div>}
            {!accountEditing && < div >
                <input name='filter' value={filter} onChange={(e) => setFilter(e.target.value)}></input>
                <button type='button' onClick={() => populateAccounts(filter)}>Filter</button>
                <br />
                <table className="table table-striped" aria-labelledby="tableLabel">

                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            {!props.disableEditing && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account =>
                            <tr key={account.id} onClick={() => {
                                if (!props.disableEditing) {
                                    setAccountEditing(account);
                                }
                                if (props.accountSelected) {
                                    props.accountSelected(account);
                                }
                            }
                            } className="recordList">
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                {!props.disableEditing && <td className="exclude" onClick={(e) => { e.stopPropagation(); removeAccount(account) }}>Remove</td>}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>}
            {!props.disableEditing && accountEditing && <div>
                <button type="button" value="Return" onClick={() => setAccountEditing(undefined)} >Return</button>
                <AccountEdit account={accountEditing} afterUpdate={() => { populateAccounts(); }} /></div>}
        </div>;

    return (
        <div>
            {contents}
        </div>
    );

    async function populateAccounts(fil?: string) {
        const response = await fetch(fil ? 'api/Account?filter=' + fil : 'api/Account');
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
            })
                .then((res) => {
                    if (res.ok) {
                        populateAccounts('');
                        if (message) {
                            message('Account Deleted!');
                        }
                    } else {
                        res.json().then((json) => {
                            const { detail, instance } = json;
                            throw new Error(detail + " - " + instance);
                        })
                            .catch((error) => {
                                alert(error);
                            });
                    }
                })
        }
    };
}
