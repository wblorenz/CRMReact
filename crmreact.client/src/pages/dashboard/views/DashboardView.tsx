import { useEffect, useState } from "react";
import { Dashboard } from '../models/Dashboard.tsx';

export function DashboardView() {
    const [dto, setDTO] = useState<Dashboard>({ numberOfAccounts: 0, numberOfContacts: 0, numberOfTicketsClosed: 0, numberOfTicketsOpen: 0, notLoaded: true });
    useEffect(() => {
        fetch('/api/Dashboard')
            .then((e) => {
                if (e.ok) {
                    e.json().then((json) => {
                        setDTO(json);
                    });
                }
            });
    }, []);
    const ret = dto.numberOfAccounts + " -  " + dto.numberOfContacts + " - " + dto.numberOfTicketsClosed + " - " + dto.numberOfTicketsOpen;
    return (

        <p>{!dto.notLoaded && ret}{dto.notLoaded && "Loading"}</p>

    );
}
