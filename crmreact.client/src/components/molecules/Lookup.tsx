import { PropsWithChildren } from 'react';
import { GetPopupContext } from './Popup';

export interface LookupProps {
    title: string;
    id: string;
    value: string;
    label: string;
    placeholder?: string;
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
    };

    return (
        <div className="form-field">
            <label>{props.label}</label>
            <div className="form-input-group">
                <input
                    name="text"
                    value={props.value || ''}
                    placeholder={props.placeholder || "Select an option..."}
                    readOnly
                    style={{ backgroundColor: 'var(--bg-surface-subtle)', cursor: 'pointer' }}
                    onClick={openPopup}
                />
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={openPopup}
                    style={{ flexShrink: 0 }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Select
                </button>
            </div>
        </div>
    );
}
