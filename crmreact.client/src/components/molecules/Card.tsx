import React from 'react';
import './Card.css'

export interface CardProps {
  title?: string;
  children?: React.ReactNode;
}

export function Card(props: CardProps) {
    return <div className="card">
        {props.title && <div className="card-header">{props.title}</div>}
        <div className="card-body">
            {props.children}
        </div>
    </div>
};

export default Card;