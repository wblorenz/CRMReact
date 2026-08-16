import { useEffect, useState } from "react";
import { Dashboard } from '../models/Dashboard.tsx';
import { Card } from '../../../components/molecules/Card.tsx';
import styles from './DashboardView.module.css';

export function DashboardView() {
    const [dto, setDTO] = useState<Dashboard>({
        numberOfAccounts: 0,
        numberOfContacts: 0,
        numberOfTicketsClosed: 0,
        numberOfTicketsOpen: 0,
        notLoaded: true
    });

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

    return (
        <div className={styles.wrapper}>
            <div className="view-header">
                <div>
                    <h2 className="view-title">Dashboard Overview</h2>
                    <p className={styles.subtitle}>Real-time metrics and activity across your contacts, accounts, and tickets.</p>
                </div>
            </div>

            {dto.notLoaded ? (
                <div className={styles.loadingContainer}>
                    <div className="crm-spinner" />
                    <span>Loading statistics...</span>
                </div>
            ) : (
                <div className={styles.metricsGrid}>
                    <Card
                        title="Open Tickets"
                        variant="warning"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        }
                    >
                        {dto.numberOfTicketsOpen}
                    </Card>

                    <Card
                        title="Resolved Tickets"
                        variant="success"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        }
                    >
                        {dto.numberOfTicketsClosed}
                    </Card>

                    <Card
                        title="Total Accounts"
                        variant="primary"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                        }
                    >
                        {dto.numberOfAccounts}
                    </Card>

                    <Card
                        title="Total Contacts"
                        variant="default"
                        icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        }
                    >
                        {dto.numberOfContacts}
                    </Card>
                </div>
            )}
        </div>
    );
}

export default DashboardView;
