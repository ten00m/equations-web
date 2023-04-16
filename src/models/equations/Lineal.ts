import {Equation} from '../Equation'
import {parse} from 'mathjs'

export class Lineal {
	coeffs: Array<number>;
	solutions: Array<any>;
	stepByStep: Array<any>

	constructor(coeffsArr: Array<number>, stepByStep: Array<any>){
		this.coeffs = coeffsArr;
		this.stepByStep = stepByStep
		this.solutions = this.solve();
	}

	solve(){
		let answers = [];
		const [a, b] = this.coeffs.reverse()
        let ans = parse(`-${b} / ${a}`);;

		this.stepByStep.push([
			"Корень линейного уравнения",
			'x =' + ans.toTex()
		])

        answers.push(ans)

		return answers
	} 
}