import {Equation} from '../Equation'
import {parse} from 'mathjs'

export class Lineal {
	coeffs: Array<number>;
	solutions: Array<any>;

	constructor(coeffsArr: Array<number>){
		this.coeffs = coeffsArr;
		this.solutions = this.solve();
	}

	solve(){
		let answers = [];
		const [a, b] = this.coeffs.reverse()
        let ans = parse(`-${b} / ${a}`);
        answers.push(ans)

		return answers
	} 
}