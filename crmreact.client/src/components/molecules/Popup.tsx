import './Popup.css';
import { createContext, useContext } from 'react';

export type PopupModel = {
    id: string;
    content?: React.ReactNode;
    title?: string;
};

export interface PopUpProps {
    id: string;
    content?: React.ReactNode;
    title?: string;
    remove: (id: string) => void;
}

export function Popup(props: PopUpProps) {
    return (
        <div className="popup-overlay-container">
            <div className="popup-backdrop" onClick={() => props.remove(props.id)} />
            <div className="popup-dialog" key={props.id}>
                <div className="popup-header">
                    <h3 className="popup-title">{props.title || 'Details'}</h3>
                    <button
                        type="button"
                        className="popup-close-btn"
                        onClick={() => props.remove(props.id)}
                        aria-label="Close dialog"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="popup-body">
                    {props.content}
                </div>
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
        throw new Error("PopupContext not found.");
    }
    return popup;
}
