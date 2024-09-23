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
        ? <p><em>Loading...</em></p>
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
