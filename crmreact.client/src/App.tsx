import { useState, useMemo } from 'react';
import './App.css';
import { Menu, MenuItem } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/views/AccountsList.tsx';
import { ContactsList } from './pages/contacts/views/ContactsList.tsx';
import { Popup } from './components/molecules/Popup.tsx';
import { Weather } from './pages/weather/Weather.tsx';

function App() {
    const [popups, setPopups] = useState<JSX.Element[]>([]);
    const addPopup = (pop: JSX.Element) => {
        setPopups([...popups, pop]);
    }
    const removePopup = (popId: number) => {

        setPopups((p) => {
            return p.filter((_, i) => i !== popId);
        });
    }
    const menuItems = useMemo(() => {
        return [
            { description: 'Accounts', location: "account", screen: (<AccountsList asLookup={false} />) },
            { description: 'Contacts', location: "contacts", screen: (<ContactsList addPopup={addPopup} />) },
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
        <div style={{ height: "98vh", boxSizing: "border-box" }}>
            <div className='title'><h1>React CRM</h1></div>
            <div className='Home'>
                <Menu items={menuItems} onClickMenu={onClickMenu} />
                <div className='container'>
                    {screen}
                </div>
            </div>
            <div>
                {popups.map((pop, i) => (
                    <Popup content={pop} id={i} key={i} remove={(e) => removePopup(i) } />
            ))}
            </div>
        </div>
    );
}

export default App;