import { useState, useMemo, useReducer } from 'react';
import './App.css';
import { Menu, MenuItem } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/views/AccountsList.tsx';
import { ContactsList } from './pages/contacts/views/ContactsList.tsx';
import { Popup, PopupModel } from './components/molecules/Popup.tsx';
import { QuickMessage, QuickMessageContext } from './components/molecules/QuickMessage.tsx';
import { PopupContext, PopupContextMethodParams } from './context/PopupContext.tsx';

const addPopup = (popups: PopupModel[], action: PopupContextMethodParams) => {
    switch (action.type) {
        case 'add': {
            return [...popups, { id: action.id, content: action.content }];
        }
        case 'remove': {
            return popups.filter((i) => i.id !== action.id);
        }
    }
}
function App() {
    const [popups, dispatch] = useReducer<((popups: PopupModel[], action: PopupContextMethodParams) => PopupModel[]), PopupModel[]>(addPopup, []);
    const menuItems = useMemo(() => {
        return [
            { description: 'Accounts', location: "account", screen: (<AccountsList showEditing={false} />) },
            { description: 'Contacts', location: "contacts", screen: (<ContactsList />) },
        ]
    }, []);
    const onClickMenu = function (sel: MenuItem) {
        if (sel.location !== selected) {
            setSelected(sel.location);
            setScreen(sel.screen);
        }
    }

    const [selected, setSelected] = useState<string>(menuItems[0].location);
    const [screen, setScreen] = useState<JSX.Element>(menuItems[0].screen);
    const [quickMsg, setQuickMsg] = useState<string>('');
    const setMessage = (s: string) => {
        setQuickMsg(s);
        setTimeout(() => {
            const quick = document.getElementById('quickMessage');
            if (quick) quick.className += " quickMessageMoving";

        }, 100)
        setTimeout(() => {
            setQuickMsg('');
            const quick = document.getElementById('quickMessage');
            if (quick) quick.className = "quickMessage";
        }, 1500);
    }
    return (
        <PopupContext.Provider value={dispatch}>
            <QuickMessageContext.Provider value={setMessage}>
                <div style={{ height: "98vh", boxSizing: "border-box" }}>
                    <div className='title'><h1>React CRM</h1></div>
                    <div className='Home'>
                        <Menu items={menuItems} onClickMenu={onClickMenu} />
                        <div className='container'>
                            {screen}
                        </div>
                    </div>
                    <div>
                        {popups.map((pop: PopupContextMethodParams) => (
                            <Popup content={pop.content} title='teste' id={pop.id} key={pop.id} remove={() => dispatch({
                                id: pop.id,
                                type: 'remove'
                            })} />
                        ))}
                    </div>
                    {quickMsg !== '' && <QuickMessage message={quickMsg}></QuickMessage>}
                </div>
            </QuickMessageContext.Provider>
        </PopupContext.Provider>
    );
}

export default App;