import 'react';
import './Tab.css';
export class TabItem {

    description!: string;
    location!: string;
    id: string;

}
export declare interface TabProp {
    items: TabItem[];
    exclude: (selected: TabItem) => void;
}
export function Tab(prop: TabProp) {
    const items = prop.items;
    return (
        <ul className='Tab'>
            {items.map(item => {
                return <li key={item.location}onClick={function () { prop.exclude(item); }}>{item.description}</li>;
            })}
        </ul>
    );
}

