import { createContext, useState, useEffect, useContext } from 'react';
import styles from './QuickMessage.module.css';

export interface QuickMessageProps {
    message: string;
    removeMessage: () => void;
}

export const QuickMessageContext = createContext<((str: string) => void) | undefined>(undefined);

export function QuickMessage(props: QuickMessageProps) {
    const { removeMessage } = props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setVisible(true);
        }, 50);

        const timer2 = setTimeout(() => {
            setVisible(false);
        }, 2600);

        const timer3 = setTimeout(() => {
            removeMessage();
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [removeMessage]);

    return (
        <div className={`${styles.toast} ${visible ? styles.visible : ''}`}>
            <div className={styles.icon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <span className={styles.text}>{props.message}</span>
        </div>
    );
}

export function GetQuickMessageContext() {
    const message = useContext(QuickMessageContext);
    if (message === undefined) {
        throw new Error("There's no Quick Message Context");
    }
    return message;
}