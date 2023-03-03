import {parse} from 'mathjs'

export class Quadratic {
	coeffs: Array<number>;
	solutions: Array<any>;

	constructor(coeffsArr: Array<number>){
		this.coeffs = coeffsArr;
		this.solutions = this.solve()
	}

	solve(): Array<any>{
		let answers: Array<any> = [];
		const [a, b, c] = this.coeffs.reverse();
		const d = parse(`(${b})^2 - 4*${a}*${c}`);
		if(d.evaluate() > 0){
			const root1 = parse(`-${b}/(2*${a}) + sqrt(${d})/(2*${a})`);
			const root2 = parse(`-${b}/(2*${a}) - sqrt(${d})/(2*${a})`);
			answers.push(root1, root2)
		} else if(d.evaluate() === 0){
			const root0 = parse(`-${b}/(2*${a})`);
			answers.push(root0)
		} else{}

		return answers
	}

}