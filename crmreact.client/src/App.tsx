import { useState, useEffect } from 'react';
import './App.css';
import { Field } from './components/atoms/Field.tsx';
import { Menu } from './components/molecules/Menu.tsx';

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
    render: boolean;
}

function App() {
    const [forecasts, setForecasts] = useState<Forecast[]>();
    const menuItems = [
        { description: 'test', location: "teste2" },
        { description: 'test2', location: "teste3" },

    ];
    useEffect(() => {
         populateWeatherData();
    }, []);
    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        :
        <div>
            <div style={{ float: 'left' }} >
                <Menu items={menuItems} />
            </div>
            <div>
                <table className="table table-striped" aria-labelledby="tableLabel">

                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temp. (C)</th>
                            <th>Temp. (F)</th>
                            <th>Summary</th>
                            <th>Field</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecasts.map(forecast =>
                            <tr key={forecast.date}>
                                <td>{forecast.date}</td>
                                <td>{forecast.temperatureC}</td>
                                <td>{forecast.temperatureF}</td>
                                <td>{forecast.summary} dsadsa</td>
                                <td><Field beg={forecast.summary} novo={forecast.render} /> </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>;

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateWeatherData() {
        const response = await fetch('api/weatherforecast');
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {

            data[i].render = false;
        }
        setForecasts(data);
    };
}

export default App;