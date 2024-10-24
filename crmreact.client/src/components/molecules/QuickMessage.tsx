import { createContext } from 'react';
import './QuickMessage.css';

export interface QuickMessageProps {
    message: string;
}

export const QuickMessageContext = createContext<((str: string) => void) | undefined>(undefined);
export function QuickMessage(props: QuickMessageProps) {

    return <div className='quickMessage' id='quickMessage'>
        <span>{props.message}</span>
    </div>
}