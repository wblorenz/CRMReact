import { useState, useMemo } from 'react';
import './App.css';
import { Menu, MenuItem } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/screens/AccountsList.tsx';
import { Weather } from './pages/weather/Weather.tsx';

function App() {
    const menuItems = useMemo(() => {
        return [
            { description: 'Accounts', location: "account", screen: (<AccountsList />) },
            { description: 'Weather Test', location: "weather", screen: (<Weather />) },
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
    return (
        <div>
            <div className='title'><h1>React CRM</h1></div>
            <div style={{ width: '100%' }}>
                <Menu items={menuItems} onClickMenu={onClickMenu} />
                <div className='container'>
                    {screen}
                </div>
            </div>
        </div>
    );
}

export default App;