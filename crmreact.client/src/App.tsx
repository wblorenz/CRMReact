import { useState, useMemo } from 'react';
import './App.css';
import { Menu, MenuItem } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/screens/AccountsList.tsx';
import { Weather } from './pages/weather/Weather.tsx';
import { Tab, TabItem } from './components/molecules/Tab.tsx';

function App() {
    const menuItems = useMemo(() => {
        return [
            { description: 'Accounts', location: "account", screen:  (<AccountsList />) },
            { description: 'Weather Test', location: "weather", screen: (<Weather />) },
        ]
    }, []);

    const onClickMenu = function (sel: MenuItem) {
        if (sel.location !== selected) {
            let scr = arr.find((j) => j.location == sel.location)?.screen;
            if (!scr) {
                scr = sel.screen;
                arr.push({ "description": sel.description, "location": sel.location, id: "t" + Math.random(), screen: sel.screen });
            }
            setSelected(sel.location);
            setScreen(scr);
        }
    }
    const exclude = function (selected: TabItem) {
        const a = arr.filter((tab) => tab.id != selected.id);
        setArr([...a]);
    }
    const [selected, setSelected] = useState<string>(menuItems[0].location);
    const [arr, setArr] = useState<TabItem[]>([]);
    const [screen, setScreen] = useState<JSX.Element>(menuItems[0].screen);
    return (
        <div>
            <div style={{ width: '100%' }}>
                <Menu items={menuItems} onClickMenu={onClickMenu} />
                <div className='container'>
                    {screen}
                </div>
            </div>
            <div><Tab items={arr} exclude={exclude} /></div>
        </div>
    );
}

export default App;