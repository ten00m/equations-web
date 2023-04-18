import React,{FC, useState} from 'react';
import classes from './Keyboard.module.css'
import keyb from '../../assets/keyb_icon.png'
import { MathComponent } from 'mathjax-react';

interface KeyboardPorps{
    keyDown: (key: string) => void;
    setIsKeyb: (isKeyb: boolean) => void
}

const Keyboard: FC<KeyboardPorps> = ({keyDown, setIsKeyb}) => {
    const [isHidden, setIsHidden] = useState(true);
    const keys = [
        'c', '7', '8', '9', '+',
        String.raw`\leftarrow`, '4', '5', '6', '-',
        'x^3', '1', '2', '3', '*',
        'x^2', '.', '0', 'a^b', '/',
        'x', '(', ')', String.raw`\sqrt{}`, '=',
    ]


    const openKeyb = () => {
        setIsHidden(!isHidden)
        setIsKeyb(isHidden)
    }

    return (
        <div className={`${classes.keyboard_cont} ${isHidden ? "hidden" : ""}`}>
            <div className={classes.keyb_icon}
                onClick={openKeyb}
            >
                <img src={keyb} alt="" />
            </div>
            <ul className={`${classes.keyboard}`} style={isHidden ? {'display': 'none'}: {}}>
               {
                keys.map((k, ind) => {
                    return (
                        <li 
                            className={classes.key}
                            onClick={() => keyDown(k)}
                            key={ind}
                            
                        >
                            <MathComponent tex={k}/>
                        </li>
                    )
                })
               }
            </ul>
        </div>
    )
}

export default Keyboard