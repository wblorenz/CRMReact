import { useState, useEffect } from 'react';
import { Account } from '../models/Account.tsx';
import { AccountEdit } from './AccountEdit.tsx';
import { GetQuickMessageContext } from '../../../components/molecules/QuickMessage.tsx';
import { Pagination } from '../../../components/molecules/Pagination.tsx';
export interface AccountListProps {
    showEditing: boolean;
    accountSelected?: (acc: Account) => void;
}
export function AccountsList(props: AccountListProps) {
    const [accounts, setAccounts] = useState<Account[]>();
    const [filter, setFilter] = useState<string>('');
    const [accountEditing, setAccountEditing] = useState<Account>();
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const message = GetQuickMessageContext();
    useEffect(() => {
        populateAccounts(filter, currentPage);
    }, []);
    const contents = accounts === undefined
        ? <p><em>Loading... </em></p>
        :
        <div>
            {props.showEditing && !accountEditing && < div className="form-actions"> <button type="button" value="New Account" onClick={() => { setAccountEditing(new Account()) }} >New Account</button></div>}
            {!accountEditing && < div >
                <div className="form-actions">
                    <input name='filter' value={filter} placeholder='teste' onChange={(e) => setFilter(e.target.value)}></input>
                    <button type='button' onClick={() => populateAccounts(filter, currentPage)}>Filter</button>
                </div>
                <div style={{ overflow: 'auto' }}>
                    <table className="table table-striped" aria-labelledby="tableLabel">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                {props.showEditing && <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map(account =>
                                <tr key={account.id} onClick={() => {
                                    if (props.showEditing) {
                                        setAccountEditing(account);
                                    }
                                    if (props.accountSelected) {
                                        props.accountSelected(account);
                                    }
                                }
                                } className="recordList">
                                    <td>{account.id}</td>
                                    <td>{account.name}</td>
                                    {props.showEditing && <td className="exclude" onClick={(e) => { e.stopPropagation(); removeAccount(account) }}>Remove</td>}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={(e) => { setCurrentPage(e); populateAccounts(filter, e); }} />
                </div>
            </div>}
            {props.showEditing && accountEditing && <div>
                <button type="button" value="Return" onClick={() => setAccountEditing(undefined)} >Return</button>
                <AccountEdit account={accountEditing} afterUpdate={() => { populateAccounts(filter, currentPage); }} /></div>}
        </div>;

    return (
        <div>
            {contents}
        </div>
    );

    async function populateAccounts(fil: string, page: number) {
        const from = page * 10;
        const to = from + 10;
        let addr = 'api/Account?from=' + from + '&to=' + to;
        if (fil !== "") {
            addr += '&filter=' + fil;
        }
        const response = await fetch(addr);
        const data = await response.json();
        setAccounts(data.entities);
        setTotalPages(Math.floor(data.count / 10));
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
                        populateAccounts(filter, currentPage);
                        message('Account Deleted!');
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
