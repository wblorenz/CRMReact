import { useState, useMemo } from 'react';

interface Account {
    id: string;
    name: string;
}

export function AccountsList() {
    const [accounts, setAccounts] = useState<Account[]>();
    useMemo(() => {
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
                        {accounts.map(forecast =>
                            <tr key={forecast.id}>
                                <td>{forecast.id}</td>
                                <td>{forecast.name}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
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
}
