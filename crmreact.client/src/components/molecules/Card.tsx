import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
    title?: string;
    children?: React.ReactNode;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
}

export function Card(props: CardProps) {
    const variantClass = props.variant === 'warning'
        ? styles.variantWarning
        : props.variant === 'success'
        ? styles.variantSuccess
        : props.variant === 'danger'
        ? styles.variantDanger
        : props.variant === 'primary'
        ? styles.variantPrimary
        : '';

    return (
        <div className={`${styles.card} ${variantClass}`.trim()}>
            <div className={styles.cardTop}>
                {props.title && <span className={styles.cardTitle}>{props.title}</span>}
                {props.icon && <div className={styles.cardIcon}>{props.icon}</div>}
            </div>
            <div className={styles.cardValue}>
                {props.children}
            </div>
            {props.subtitle && <div className={styles.cardSubtitle}>{props.subtitle}</div>}
        </div>
    );
}

export default Card;