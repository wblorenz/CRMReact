import './Popup.css';
export interface PopupModel {
    id: number;
    content: JSX.Element;
}
export interface PopUpProps {
    id: number;
    content: JSX.Element;
    remove: (id: number) => void;
}
export function Popup(props: PopUpProps) {
    return (
        <div>
        <div className="popupBackground" onClick={()=>props.remove(props.id)}>
        </div>
            <div className="popupBase" key={props.id}>
                {props.content}
            </div>
        </div>
    );
}
