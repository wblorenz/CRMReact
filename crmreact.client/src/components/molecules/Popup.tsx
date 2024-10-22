import './Popup.css';
export interface PopupModel {
    id: number;
    content: JSX.Element;
    title: string;
}
export interface PopUpProps {
    id: number;
    content: JSX.Element;
    title: string;
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
