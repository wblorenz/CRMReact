import { useState } from 'react';
import './App.css';
import { Menu } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/AccountsList.tsx';
import { Weather } from './pages/weather/Weather.tsx';
import { Tab, TabItem } from './components/molecules/Tab.tsx';

function App() {
    const menuItems = [
        { description: 'Accounts', location: "account" },
        { description: 'Weather Test', location: "weather" },
    ];
    const accounts = (<AccountsList />);
    const weather = (<Weather />);

    const [selected, setSelected] = useState<string>('weather');
    const [arr, setArr] = useState<TabItem[]>([]);
    const setSelectedTeste = function (sel: string) {
        if (sel !== selected) {
            arr.push({ "description": sel + Math.random(), "location": "teste321321" + Math.random(), id: "t" + Math.random() });
        }
        setSelected(sel);
    }
    const exclude = function (selected: TabItem) {
        const a = arr.filter((tab) => tab.id != selected.id);
        setArr([...a]);
    }
    return (
        <div>
            <div style={{ width: '100%' }}>
                <Menu items={menuItems} setSelected={setSelectedTeste} />
                {selected === "account" ? (
                    <div className='container'> {accounts} </div>) :
                    selected === 'weather' ? (
                        <div className='container'>
                            {weather}
                        </div>
                    ) :
                        <div></div>
                }
            </div>
            <div><Tab items={arr} exclude={exclude} /></div>
        </div>
    );
}

export default App;