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

    async function populateAccounts(fil: string, page: number) {
        const from = page * 10;
        const to = from + 10;
        let addr = 'api/Account?from=' + from + '&to=' + to;
        if (fil !== "") {
            addr += '&filter=' + encodeURIComponent(fil);
        }
        try {
            const response = await fetch(addr);
            if (response.ok) {
                const data = await response.json();
                setAccounts(data.entities || []);
                setTotalPages(Math.floor((data.count || 0) / 10));
            }
        } catch (err) {
            console.error("Failed to load accounts", err);
        }
    }

    function removeAccount(acc: Account) {
        if (confirm("Are you sure you want to delete the account: " + acc.name + "?")) {
            fetch('api/Account/' + acc.id, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Id: acc.id })
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
                });
        }
    }

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        populateAccounts(filter, 0);
    };

    if (accountEditing) {
        return (
            <div>
                <div className="view-header">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setAccountEditing(undefined)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Accounts
                    </button>
                </div>
                <AccountEdit
                    account={accountEditing}
                    afterUpdate={() => {
                        populateAccounts(filter, currentPage);
                        setAccountEditing(undefined);
                    }}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="view-header">
                <div>
                    <h2 className="view-title">Accounts</h2>
                </div>
                {props.showEditing && (
                    <button
                        type="button"
                        onClick={() => setAccountEditing(new Account())}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Account
                    </button>
                )}
            </div>

            <form onSubmit={handleFilterSubmit} className="view-toolbar">
                <div className="search-input-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        name='filter'
                        value={filter}
                        placeholder='Search accounts...'
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <button type='submit' className="btn-secondary">Filter</button>
            </form>

            {accounts === undefined ? (
                <div className="empty-state">
                    <div className="crm-spinner" style={{ margin: '0 auto 1rem auto' }} />
                    <span>Loading accounts...</span>
                </div>
            ) : accounts.length === 0 ? (
                <div className="empty-state">
                    <p>No accounts found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="table-container">
                        <table className="table" aria-labelledby="tableLabel">
                            <thead>
                                <tr>
                                    <th style={{ width: '90px' }}>ID</th>
                                    <th>Account Name</th>
                                    {props.showEditing && <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map(account => (
                                    <tr
                                        key={account.id}
                                        onClick={() => {
                                            if (props.showEditing) {
                                                setAccountEditing(account);
                                            }
                                            if (props.accountSelected) {
                                                props.accountSelected(account);
                                            }
                                        }}
                                        className="recordList"
                                    >
                                        <td>
                                            <span className="record-badge">#{account.id}</span>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{account.name}</td>
                                        {props.showEditing && (
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    type="button"
                                                    className="action-btn-danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAccount(account);
                                                    }}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={(e) => {
                            setCurrentPage(e);
                            populateAccounts(filter, e);
                        }}
                    />
                </>
            )}
        </div>
    );
}
