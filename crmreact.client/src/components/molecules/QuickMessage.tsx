import { createContext, useRef, useEffect } from 'react';
import './QuickMessage.css';

export interface QuickMessageProps {
    message: string;
    removeMessage: () => void;
}

export const QuickMessageContext = createContext<((str: string) => void) | undefined>(undefined);
export function QuickMessage(props: QuickMessageProps) {
    const { removeMessage } = props;
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setTimeout(() => {
            if (divRef && divRef.current)
                divRef.current.className = "quickMessage quickMessageMoving";
        }, 100);

        setTimeout(() => {
            if (divRef && divRef.current)
                divRef.current.className = "quickMessage";
        }, 1500);
        setTimeout(() => {
            removeMessage();
        }, 3000);
    }, [removeMessage]);
    return <div className='quickMessage' ref={divRef}>
        <span>{props.message}</span>
    </div>
}