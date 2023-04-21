import React, { FC } from "react";
import classes from './LatexOut.module.css'
import { MathComponent } from "mathjax-react";

interface LatexProps{
    solution: Array<any>;
    getParsedSol: (s: any) => string
}

const LatexOut: FC<LatexProps> = ({solution, getParsedSol}) => {

    return (
        <div className={classes.rootCont}>
			<h3 className={solution.length ? "" : "hidden"}>
				Корни уравнения
			</h3>
    		{
    			solution[0] !== 'none'
    			? solution.map((s, n) => 
    				<MathComponent tex={`x_${n + 1} = ${getParsedSol(s)}`} key={n}/>
    			)
    			: <p>Корни не найдены</p>
    		}	
        </div>
    )
}

export default LatexOut