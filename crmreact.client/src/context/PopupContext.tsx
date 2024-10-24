import { createContext } from 'react';
export const PopupContext = createContext<((action: PopupContextMethodParams) => void)>(()=>undefined);
export interface PopupContextMethodParams {
    id: number;
    type: 'add'|'remove';
    title?: string;
    content?: JSX.Element;
}
