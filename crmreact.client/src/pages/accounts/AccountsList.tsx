import { useState, useEffect } from 'react';

interface Account {
    id: string;
    name: string;
}

export function AccountsList() {
    const [accounts, setAccounts] = useState<Account[]>();
    useEffect(() => {
        populateAccounts();
    }, []);
    const contents = accounts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
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
            <h1 id="tableLabel">Accounts</h1>
            {contents}
        </div>
    );

    async function populateAccounts() {
        const response = await fetch('api/Account');
        const data = await response.json();
        setAccounts(data);
    };
}
