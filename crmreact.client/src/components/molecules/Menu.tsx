import 'react';
import './Menu.css';
export class MenuItem {

    description!: string;
    location!: string;
    view!: JSX.Element;
}
export declare interface MenuProp {
    items: MenuItem[];
    onClickMenu: (selected: MenuItem) => void;
}
export function Menu(prop: MenuProp) {
    const items = prop.items;
    return (
        <ul className='Menu'>
            {items.map(item => {
                return <li key={item.location} onClick={function () { prop.onClickMenu(item); }}>{item.description}</li>;
            })}
        </ul>
  );
}

