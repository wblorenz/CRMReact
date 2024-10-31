import { PropsWithChildren } from 'react';
import { GetPopupContext } from './Popup';
export interface LookupProps {
    title: string;
    id: number;
    value: string;
    label: string;
}
export function Lookup(props: PropsWithChildren<LookupProps>) {
    const dispatch = GetPopupContext();
    const openPopup = () => {
        dispatch({
            id: props.id,
            type: 'add',
            title: props.title,
            content: props.children,
        });

    }
    return (
        <div className="form-field">
            <label>{props.label}</label>
            <div>
                <input name="text" value={props.value} readOnly></input>
                <button type="button" onClick={() => openPopup()}>Select</button>
            </div>
        </div>
    );
}

