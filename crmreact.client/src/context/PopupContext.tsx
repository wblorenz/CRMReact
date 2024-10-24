import { createContext } from 'react';
import { PopupModel } from '../components/molecules/Popup';
export const PopupContext = createContext<null |  ((popups: PopupModel[], action: PopupContextMethodParams) => void)>(null);
export interface PopupContextMethodParams {
    id: number;
    type: 'add'|'remove';
    title: string;
    content?: JSX.Element;
}
