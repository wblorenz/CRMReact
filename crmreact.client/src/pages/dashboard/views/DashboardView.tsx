import { useEffect, useState } from "react";
import { Dashboard } from '../models/Dashboard.tsx';
import { Card } from '../../../components/molecules/Card.tsx'
import styles from  './DashboardView.module.css'

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
    const content = <>
        <Card title="Open Tickets" children={dto.numberOfTicketsOpen} />
        <Card title="Closed Tickets" children={dto.numberOfTicketsClosed} />
        <Card title="Accounts" children={dto.numberOfAccounts} />
        <Card title="Contacts" children={dto.numberOfContacts} />
    </>;
    return (
        <div className={styles.container}>
            {!dto.notLoaded && content}
            {dto.notLoaded && "Loading"}
        </div>
    );
}
