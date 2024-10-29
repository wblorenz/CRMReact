import { createContext, useContext } from 'react';
export const PopupContext = createContext<((action: PopupContextMethodParams) => void)>(()=>undefined);
export interface PopupContextMethodParams {
    id: number;
    type: 'add'|'remove';
    title?: string;
    content?: JSX.Element;
}

export function GetPopupContext() {
    const popop = useContext(PopupContext);
    if (popop === undefined){
        throw new Error("PopupContext not found.")
    }
    return popup;
}
