import 'react';
import './Menu.css';
export class MenuItem {

    description!: string;
    location!: string;

}
export declare interface MenuProp {
    items: MenuItem[];
}
export function Menu(prop: MenuProp) {
    const items = prop.items;
    return (
        <ul className='Menu'>
            {items.map(item => {
                return <li key={item.location}>{item.description}</li>;
            })}
        </ul>
  );
}

