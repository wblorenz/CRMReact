import { createContext, useRef, useEffect } from 'react';
import './QuickMessage.css';

export interface QuickMessageProps {
    message: string;
    removeMessage: () => void;
}

export const QuickMessageContext = createContext<((str: string) => void) | undefined>(undefined);
export function QuickMessage(props: QuickMessageProps) {
    const divRef = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            if (divRef && divRef.current)
                divRef.current.className += " quickMessageMoving";
        }, 100);

        setTimeout(() => {
            if (divRef && divRef.current)
                divRef.current.className = "quickMessage";
        }, 1500);
        setTimeout(() => {
            props.removeMessage();

        }, 3000);
    }, []);
    return <div className='quickMessage' id='quickMessage' ref={divRef}>
        <span>{props.message}</span>
    </div>
}