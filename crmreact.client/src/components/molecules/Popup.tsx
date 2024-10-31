import './Popup.css';
import { createContext, useContext } from 'react';
export type PopupModel = {
    id: number;
    content?: React.ReactNode;
    title?: string;
}
export interface PopUpProps {
    id: number;
    content?: React.ReactNode;
    title?: string;
    remove: (id: number) => void;
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
    id: number;
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
