import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';

export class MenuItem {
    description!: string;
    location!: string;
    path?: string;
    view?: JSX.Element;
    icon?: React.ReactNode;
}

export interface MenuProp {
    items?: MenuItem[];
    selected?: string;
    onClickMenu?: (selected: MenuItem) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: (collapsed: boolean) => void;
}

const defaultMenuItems: MenuItem[] = [
    { description: 'Dashboard', location: 'dashboard', path: '/dashboard' },
    { description: 'Accounts', location: 'accounts', path: '/accounts' },
    { description: 'Contacts', location: 'contacts', path: '/contacts' },
    { description: 'Tickets', location: 'tickets', path: '/tickets' },
];

const getMenuIcon = (location: string) => {
    switch (location.toLowerCase()) {
        case 'dashboard':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                </svg>
            );
        case 'accounts':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            );
        case 'contacts':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            );
        case 'tickets':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path>
                    <line x1="12" y1="5" x2="12" y2="19" strokeDasharray="3 3"></line>
                </svg>
            );
        default:
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
            );
    }
};

export function Menu(prop: MenuProp) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname.toLowerCase();

    const [collapsedInternal, setCollapsedInternal] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('crm_menu_collapsed');
            return saved === 'true';
        }
        return false;
    });

    const isCollapsed = prop.isCollapsed !== undefined ? prop.isCollapsed : collapsedInternal;

    const handleToggle = () => {
        const nextState = !isCollapsed;
        setCollapsedInternal(nextState);
        try {
            localStorage.setItem('crm_menu_collapsed', String(nextState));
        } catch {
            // ignore localStorage quota errors
        }
        if (prop.onToggleCollapse) {
            prop.onToggleCollapse(nextState);
        }
    };

    const items = prop.items ?? defaultMenuItems;

    const isItemActive = (item: MenuItem) => {
        if (prop.selected) {
            return prop.selected.toLowerCase() === item.location.toLowerCase();
        }
        const itemPath = (item.path ?? `/${item.location}`).toLowerCase();

        if (itemPath === '/dashboard') {
            return currentPath === '/' || currentPath === '/dashboard';
        }

        return (
            currentPath === itemPath ||
            currentPath.startsWith(itemPath + '/')
        );
    };

    const handleItemClick = (item: MenuItem) => {
        const targetPath = item.path ?? `/${item.location}`;
        navigate(targetPath);
        if (prop.onClickMenu) {
            prop.onClickMenu(item);
        }
    };

    return (
        <aside
            className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
            aria-label="Main Navigation"
        >
            <div className={styles.header}>
                <span className={styles.sectionLabel}>MAIN MENU</span>
                <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={handleToggle}
                    title={isCollapsed ? "Show main menu" : "Hide main menu"}
                    aria-label={isCollapsed ? "Show main menu" : "Hide main menu"}
                    aria-expanded={!isCollapsed}
                >
                    {isCollapsed ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <line x1="9" y1="3" x2="9" y2="21" />
                            <path d="m13 9 3 3-3 3" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <line x1="9" y1="3" x2="9" y2="21" />
                            <path d="m15 9-3 3 3 3" />
                        </svg>
                    )}
                </button>
            </div>
            <ul className={styles.navList}>
                {items.map(item => {
                    const isActive = isItemActive(item);
                    return (
                        <li
                            key={item.location}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            onClick={() => handleItemClick(item)}
                            title={isCollapsed ? item.description : undefined}
                        >
                            <span className={styles.iconWrapper}>
                                {item.icon ?? getMenuIcon(item.location)}
                            </span>
                            <span className={styles.label}>{item.description}</span>
                            {isActive && <span className={styles.activeIndicator} />}
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}

export default Menu;
