import { useState, useMemo, useReducer } from 'react';
import './App.css';
import { Menu, MenuItem } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/views/AccountsList.tsx';
import { ContactsList } from './pages/contacts/views/ContactsList.tsx';
import { Popup, PopupModel } from './components/molecules/Popup.tsx';
import { Weather } from './pages/weather/Weather.tsx';
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
    throw Error('teste');
}
function App() {
    //pop.popups

    const [popups, dispatch] = useReducer<PopupModel[], PopupContextMethodParams>(addPopup, []);
    const menuItems = useMemo(() => {
        return [
            { description: 'Accounts', location: "account", screen: (<AccountsList asLookup={false} />) },
            { description: 'Contacts', location: "contacts", screen: (<ContactsList />) },
            { description: 'Weather Test', location: "weather", screen: (<Weather />) },
        ]
    }, []);

    const [selected, setSelected] = useState<string>(menuItems[0].location);
    const [screen, setScreen] = useState<JSX.Element>(menuItems[0].screen);
    const onClickMenu = function (sel: MenuItem) {
        if (sel.location !== selected) {
            setSelected(sel.location);
            setScreen(sel.screen);
        }
    }
    return (
        <PopupContext.Provider value={dispatch}>
            <div style={{ height: "98vh", boxSizing: "border-box" }}>
                <div className='title'><h1>React CRM</h1></div>
                <div className='Home'>
                    <Menu items={menuItems} onClickMenu={onClickMenu} />
                    <div className='container'>
                        {screen}
                    </div>
                </div>
                <div>
                    {popups.map((pop) => (
                        <Popup content={pop.content} id={pop.id} key={pop.id} remove={() => dispatch({
                            id: pop.id,
                            type:'remove'
                        })} />
                    ))}
                </div>
            </div>
        </PopupContext.Provider>
    );
}

export default App;