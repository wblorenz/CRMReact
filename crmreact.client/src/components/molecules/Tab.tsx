import './Tab.css';

export class TabItem {
    description!: string;
    location!: string;
    id!: string;
    screen!: JSX.Element;
}

export interface TabProp {
    items: TabItem[];
    exclude: (selected: TabItem) => void;
}

export function Tab(prop: TabProp) {
    const items = prop.items;
    return (
        <ul className='tab-bar'>
            {items.map(item => (
                <li key={item.location} className="tab-bar-item">
                    <span>{item.description}</span>
                    <button
                        type="button"
                        className="tab-close-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            prop.exclude(item);
                        }}
                    >
                        ×
                    </button>
                </li>
            ))}
        </ul>
    );
}
