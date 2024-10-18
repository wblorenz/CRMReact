import { createContext } from 'react';
export const PopupContext = createContext(null);
export interface PopupContextMethodParams {
    id: number;
    type: string;
    content?: JSX.Element;
}
