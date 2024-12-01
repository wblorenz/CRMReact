import { useState, useMemo, useReducer } from 'react';
import './App.css';
import { Menu, MenuItem } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/views/AccountsList.tsx';
import { ContactsList } from './pages/contacts/views/ContactsList.tsx';
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

    const [selected, setSelected] = useState<string>(menuItems[0].location);
    const [view, setView] = useState<JSX.Element>(menuItems[0].view);
    const [quickMsg, setQuickMsg] = useState<string>('');
    return (
        <PopupContext.Provider value={dispatch}>
            <QuickMessageContext.Provider value={setQuickMsg}>
                    <div style={{ height: "98vh", boxSizing: "border-box" }}>
                        <div className='title'><h1>React CRM</h1></div>
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
        </PopupContext.Provider >
    );
}

export default App;