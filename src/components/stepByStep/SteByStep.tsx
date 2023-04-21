import React, { FC } from "react";
import classes from './StepByStep.module.css'
import { MathComponent } from "mathjax-react";

interface StepByStepProps{
    stepArr: Array<any>,
    solutions: Array<any>,
    getParsedSol: (s: any) => string
}

const StepByStep: FC<StepByStepProps> = ({stepArr, solutions, getParsedSol}) => {

    const checkNothingP = (step: string) => {
        if(step){
            return <p>{step}</p>
        }
    }

    const checkNothingMath = (step: string) => {
        if(step){
            return <MathComponent tex={step}/>
        }
    }

    return (
        <div className={classes.cont}>
            <h3 className={stepArr.length ? "" : "hidden"}>
                Пошаговое Решение
            </h3>
            {
                stepArr.map((step, key) => {
                    return (
                        <div className={classes.element} key={key}>
                            {checkNothingP(step[0])}
                            {checkNothingMath(step[1])}
                        </div>
                    )
                })
            }
                <h3 className={stepArr.length ? "": "hidden"}>
                    Полученные корни
                </h3>
            <div className={classes.element}>
            {
    			solutions[0] !== 'none'
    			? solutions.map((s, n) => 
    				<MathComponent tex={`x_${n + 1} = ${getParsedSol(s)}`} key={n}/>
    			)
    			: <p>Корни не найдены</p>
    		}
            </div>
        </div>
    )
}

export default StepByStep
