import {RationalTheoremEq} from './methods/RationalTheoremEq'
import { fCardano } from './methods/fCardano';

export class CubicEq{
	coeffs: Array<number>
	tree: any;
	solutions: Array<any>;
	stepByStep: Array<any>

	constructor(coeffs: Array<any>, tree: any, stepByStep: Array<any>){
		this.coeffs = coeffs
		this.tree = tree;
		this.stepByStep = stepByStep
		this.solutions = this.solve()
	}

	private solve(): Array<any>{
		this.stepByStep.push([
			"Кубическое уравнение",
			this.tree.toTex() + " = 0"
		])

		const symb = this.tree.toString().includes('x') ? 'x'
			: 's'

		let eq = new RationalTheoremEq(this.coeffs, this.tree, this.stepByStep, symb);
		const solutions: Array<any> = [];

		if(eq.solutions.length === 3){

			solutions.push(...eq.solutions)

		} else {
			this.stepByStep.push([
				"Количество полученных корней меньше трех, возможны иррациональные корни"
			])

			let fCard = new fCardano(this.coeffs, this.stepByStep, symb);


			if(eq.solutions.length !== 0){

				solutions.push(...eq.solutions);

				const evalSol = solutions.map(r => r.evaluate().toFixed(12))

				for(let r of fCard.solutions){

					for(let i of evalSol){
						if(!evalSol.includes(r.evaluate().toFixed(12))){
							solutions.push(r)
						}
					}
				}
			} else {
				solutions.push(...fCard.solutions)
			}
		}
		return solutions
	}
}