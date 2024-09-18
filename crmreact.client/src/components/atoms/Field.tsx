//import { useState } from 'react';
declare interface FieldProp {
    beg: string;
    novo: boolean;
}
export function Field(prop: FieldProp) {

    return (
        <span>
            <input type='text' value={prop.beg} readOnly></input>
            <input type='text' value={prop.novo ? 'teste' : 'outro'} readOnly></input>
        </span>
  );
}
