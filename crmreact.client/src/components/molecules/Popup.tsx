import './Popup.css';
import { createContext, useContext } from 'react';
export type PopupModel = {
    id: string;
    content?: React.ReactNode;
    title?: string;
}
export interface PopUpProps {
    id: string;
    content?: React.ReactNode;
    title?: string;
    remove: (id: string) => void;
}
export function Popup(props: PopUpProps) {
    return (
        <div>
            <div className="popupBackground" onClick={() => props.remove(props.id)}></div>
            <div className="popupBase"  key={props.id}>
                <div className="popupTitle" onClick={() => props.remove(props.id)}>{props.title}</div>
                {props.content}
            </div>
        </div>
    );
}

export interface PopupContextMethodParams {
    id: string;
    type: 'add' | 'remove';
    title?: string;
    content?: React.ReactNode;
}
export const PopupContext = createContext<((action: PopupContextMethodParams) => void)>(() => undefined);

export function GetPopupContext() {
    const popup = useContext(PopupContext);
    if (popup === undefined) {
        throw new Error("PopupContext not found.")
    }
    return popup;
}
