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
            <div className="popupBase"  onClick={() => props.remove(props.id)} key={props.id}>
                <div className="popupTitle">{props.title}</div>
                {props.content}
            </div>
        </div>
    );
}
