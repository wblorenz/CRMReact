import { useState, useMemo, useReducer, useEffect } from 'react';
import './App.css';
import { Menu, MenuItem } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/views/AccountsList.tsx';
import { ContactsList } from './pages/contacts/views/ContactsList.tsx';
import { Login, LoginModel } from './pages/login/Login.tsx';
import { DashboardView } from './pages/dashboard/views/DashboardView.tsx';
import { Popup, PopupModel } from './components/molecules/Popup.tsx';
import { QuickMessage, QuickMessageContext } from './components/molecules/QuickMessage.tsx';
import { PopupContext, PopupContextMethodParams } from './components/molecules/Popup.tsx';
import TicketsList from './pages/tickets/views/TicketsList.tsx';

const addPopup = (popups: PopupModel[], action: PopupContextMethodParams): PopupModel[] => {
    switch (action.type) {
        case 'add': {
            return [...popups, { id: action.id, content: action.content, title: action.title ?? "" }];
        }
        case 'remove': {
            return popups.filter((i) => i.id !== action.id);
        }
    }
};

function App() {
    const [popups, dispatch] = useReducer(addPopup, []);
    const menuItems = useMemo(() => {
        return [
            { description: 'Dashboard', location: "dashboard", view: (<DashboardView />) },
            { description: 'Accounts', location: "account", view: (<AccountsList showEditing={true} />) },
            { description: 'Contacts', location: "contacts", view: (<ContactsList showEditing={true} />) },
            { description: 'Tickets', location: "tickets", view: (<TicketsList showEditing={true} />) },
        ];
    }, []);

    const [selected, setSelected] = useState<string>(menuItems[0].location);
    const [view, setView] = useState<JSX.Element>(menuItems[0].view);
    const [quickMsg, setQuickMsg] = useState<string>('');

    const onClickMenu = function (sel: MenuItem) {
        if (sel.location !== selected) {
            setSelected(sel.location);
            setView(sel.view);
        }
    };

    const [authStatus, setAuthStatus] = useState<LoginModel>({
        isAuthenticated: false,
        user: "",
        isLoading: true
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/User/check-status');
                if (response.ok) {
                    const data = await response.json();
                    setAuthStatus({ isAuthenticated: true, user: data.username, isLoading: false });
                } else {
                    setAuthStatus({ isAuthenticated: false, user: "", isLoading: false });
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setAuthStatus({ isAuthenticated: false, user: "", isLoading: false });
            }
        };

        checkAuth();
    }, []);

    const handleLogoff = async () => {
        try {
            await fetch('/api/User/Logoff', {
                method: 'POST',
            });
        } catch (error) {
            console.error("Logoff request failed:", error);
        } finally {
            setAuthStatus({
                isAuthenticated: false,
                user: "",
                isLoading: false
            });
        }
    };

    const getInitials = (username: string) => {
        if (!username) return 'U';
        return username.substring(0, 2).toUpperCase();
    };

    return (
        <>
            {!authStatus.isLoading && authStatus.isAuthenticated && (
                <PopupContext.Provider value={dispatch}>
                    <QuickMessageContext.Provider value={setQuickMsg}>
                        <div className="crm-app-shell">
                            <header className="crm-header">
                                <div className="crm-brand">
                                    <div className="crm-logo-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="9" cy="7" r="4"></circle>
                                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                        </svg>
                                    </div>
                                    <div className="crm-brand-text">
                                        <span className="crm-brand-title">Personal CRM</span>
                                        <span className="crm-brand-subtitle">Workspace</span>
                                    </div>
                                </div>

                                <div className="crm-header-user">
                                    <div className="user-profile-badge">
                                        <div className="user-avatar">{getInitials(authStatus.user)}</div>
                                        <span className="user-name">{authStatus.user}</span>
                                    </div>
                                    <button className="crm-logout-btn" onClick={handleLogoff} title="Sign Out">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </header>

                            <main className="crm-main-layout">
                                <Menu items={menuItems} selected={selected} onClickMenu={onClickMenu} />
                                <section className="crm-content-card">
                                    {view}
                                </section>
                            </main>

                            <div className="crm-popups-layer">
                                {popups.map((pop) => (
                                    <Popup
                                        content={pop.content}
                                        title={pop.title}
                                        id={pop.id}
                                        key={pop.id}
                                        remove={() => dispatch({
                                            id: pop.id,
                                            title: pop.title,
                                            type: 'remove'
                                        })}
                                    />
                                ))}
                            </div>

                            {quickMsg !== '' && (
                                <QuickMessage message={quickMsg} removeMessage={() => setQuickMsg('')} />
                            )}
                        </div>
                    </QuickMessageContext.Provider>
                </PopupContext.Provider>
            )}

            {!authStatus.isLoading && !authStatus.isAuthenticated && (
                <Login setState={setAuthStatus} />
            )}

            {authStatus.isLoading && (
                <div className="crm-loading-screen">
                    <div className="crm-spinner" />
                    <span>Loading CRM...</span>
                </div>
            )}
        </>
    );
}

export default App;