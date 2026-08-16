import styles from './Tab.module.css';

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
        <ul className={styles.tabBar}>
            {items.map(item => (
                <li key={item.location} className={styles.tabItem}>
                    <span>{item.description}</span>
                    <button
                        type="button"
                        className={styles.closeBtn}
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

export default Tab;
