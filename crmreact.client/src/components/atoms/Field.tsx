import { useState, ChangeEvent } from 'react';
declare interface FieldProp {
    beg: string;
    novo: boolean;
}
export function Field(prop: FieldProp) {
    const [value, setValue] = useState("");
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    return (
        <span>
            <input type='text' value={prop.beg} readOnly></input>
            <input type='text' value={value} name="teste" onChange={handleChange}></input>
        </span>
    );
}
