import React, { FC } from 'react';
import classes from './EquatInp.module.css'

interface EquationInpProps{
    equatStr: string,
    solve: () => void;
    setEquationInp: (inp: string) => void;
	isKeyb: boolean
}

const EquatInp: FC<EquationInpProps> = ({equatStr, setEquationInp, solve, isKeyb}) => {


    return(
        <div className={classes.container}>
			<input 
				type="text" 
				value={equatStr} 
				onChange={(e): void => {setEquationInp(e.target.value)}}
                className={classes.inp}
				readOnly = {isKeyb}
    		/>
    		<button
				onClick={solve}
                className={classes.button}
    		>
				=
    		</button>            
        </div>
    )
}

export default EquatInp