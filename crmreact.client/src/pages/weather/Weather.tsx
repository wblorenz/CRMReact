import { useState, useEffect } from 'react';
import { Field } from '../../components/atoms/Field.tsx';

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
    render: boolean;
}

export function Weather() {
    const [forecasts, setForecasts] = useState<Forecast[]>();
    useEffect(() => {
        populateWeatherData();
    }, []);
    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        :
        <div>
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
            <h1 id="tableLabel">Weather</h1>
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
