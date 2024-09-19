import { useState } from 'react';
import './App.css';
import { Menu } from './components/molecules/Menu.tsx';
import { AccountsList } from './pages/accounts/AccountsList.tsx';
import { Weather } from './pages/weather/Weather.tsx';


function App() {
    const menuItems = [
        { description: 'Account', location: "account" },
        { description: 'Weather', location: "weather" },

    ];

    const [selected, setSelected] = useState<string>('weather');
    return (
        <div>
            <h1 id="tableLabel">CRM</h1>
            <div>
                <div style={{ float: 'left' }} >
                    <Menu items={menuItems} setSelected={setSelected} />
                </div>
                {selected === "account" ? (
                    <div style={{ float: 'left' }}>
                        <AccountsList />
                    </div>) :
                    selected === 'weather' ? (
 <div style={{ float: 'left' }}>

                        <Weather />
                        </div>
                    ):
                    <div></div>

                }
                <span>{selected}</span>
            </div>
        </div>
    );
}

export default App;