import React from 'react';
import './Card.css';

export interface CardProps {
    title?: string;
    children?: React.ReactNode;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
}

export function Card(props: CardProps) {
    const variantClass = props.variant ? `card-variant-${props.variant}` : '';

    return (
        <div className={`metric-card ${variantClass}`}>
            <div className="metric-card-top">
                {props.title && <span className="metric-card-title">{props.title}</span>}
                {props.icon && <div className="metric-card-icon">{props.icon}</div>}
            </div>
            <div className="metric-card-value">
                {props.children}
            </div>
            {props.subtitle && <div className="metric-card-subtitle">{props.subtitle}</div>}
        </div>
    );
}

export default Card;