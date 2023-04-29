import React, {FC} from "react";
import { MathComponent } from "mathjax-react";
import classes from './LiveInp.module.css'

interface inpProps{
    equatStr: string,
    parsedTexEq: string,
}

const LiveInp: FC<inpProps> = ({equatStr, parsedTexEq}) => {

    return (
        <div className={classes.inpTex}>
			{
    			equatStr !== 'undefined'
    	 		?  	<MathComponent tex={parsedTexEq} />
    			:	<div></div>
    		}
        </div>
    )
}

export default LiveInp