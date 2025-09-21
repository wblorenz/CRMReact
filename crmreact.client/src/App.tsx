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
}
function App() {
    const [popups, dispatch] = useReducer(addPopup, []);
    const menuItems = useMemo(() => {
        return [
            { description: 'Dashboard', location: "dashboard", view: (<DashboardView />) },
            { description: 'Accounts', location: "account", view: (<AccountsList showEditing={true} />) },
            { description: 'Contacts', location: "contacts", view: (<ContactsList showEditing={true} />) },
            { description: 'Tickets', location: "tickets", view: (<TicketsList showEditing={true} />) },
        ]
    }, []);
    const onClickMenu = function (sel: MenuItem) {
        if (sel.location !== selected) {
            setSelected(sel.location);
            setView(sel.view);
        }
    }
    const [authStatus, setAuthStatus] = useState<LoginModel>({
        isAuthenticated: false,
        user: "",
        isLoading: true // Start in a loading state
    });

    useEffect(() => {
        // This function will be called when the component mounts
        const checkAuth = async () => {
            try {
                // The browser automatically sends the auth cookie with the request
                const response = await fetch('/api/User/check-status');

                if (response.ok) { // Status is 200-299
                    const data = await response.json();
                    setAuthStatus({ isAuthenticated: true, user: data.username, isLoading: false });
                } else {
                    // This handles 401 Unauthorized and other errors
                    setAuthStatus({ isAuthenticated: false, user: "", isLoading: false });
                }
            } catch (error) {
                // Network errors, etc.
                console.error("Authentication check failed:", error);
                setAuthStatus({ isAuthenticated: false, user: "", isLoading: false });
            }
        };

        checkAuth();
    }, []);
    const handleLogoff = async () => {
        try {
            // 1. Call your backend endpoint to invalidate the session/cookie.
            // Make sure to replace '/api/User/logout' with your actual endpoint.
            await fetch('/api/User/Logoff', {
                method: 'POST',
            });
        } catch (error) {
            console.error("Logoff request failed:", error);
        } finally {
            // 2. ALWAYS update the state to log the user out on the client-side.
            setAuthStatus({
                isAuthenticated: false,
                user: "",
                isLoading: false
            });
        }
    };

    

    const [selected, setSelected] = useState<string>(menuItems[0].location);
    const [view, setView] = useState<JSX.Element>(menuItems[0].view);
    const [quickMsg, setQuickMsg] = useState<string>('');
    return <>
        {
            !authStatus.isLoading && authStatus.isAuthenticated && <PopupContext.Provider value={dispatch}>
                <QuickMessageContext.Provider value={setQuickMsg}>
                    <div style={{ height: "98vh", boxSizing: "border-box" }}>
                        <div className='title'>
                            <h1>React CRM</h1>
                            <span onClick={handleLogoff} style={{ cursor: 'pointer' }}>Logoff: {authStatus.user}</span>
                        </div>
                        <div className='Home'>
                            <Menu items={menuItems} onClickMenu={onClickMenu} />
                            <div className='container'>
                                {view}
                            </div>
                        </div>
                        <div>
                            {popups.map((pop) => (
                                <Popup content={pop.content} title={pop.title} id={pop.id} key={pop.id} remove={() => dispatch({
                                    id: pop.id,
                                    title: pop.title,
                                    type: 'remove'
                                })} />
                            ))}
                        </div>
                        {quickMsg !== '' && <QuickMessage message={quickMsg} removeMessage={() => setQuickMsg('')}></QuickMessage>}
                    </div>
                </QuickMessageContext.Provider>
            </PopupContext.Provider>
        }
        {
            !authStatus.isLoading && !authStatus.isAuthenticated && <Login setState={setAuthStatus} />
        }
        {
            authStatus.isLoading && <div>Loading...</div>
        }
    </>;
}

export default App;