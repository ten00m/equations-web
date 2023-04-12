import {RationalTheoremEq} from './methods/RationalTheoremEq'
import { fCardano } from './methods/fCardano';

export class CubicEq{
	coeffs: Array<number>
	tree: any;
	solutions: Array<any>

	constructor(coeffs: Array<any>, tree: any){
		this.coeffs = coeffs
		this.tree = tree
		this.solutions = this.solve()
	}

	private solve(): Array<any>{
		let eq = new RationalTheoremEq(this.coeffs, this.tree);
		const solutions: Array<any> = []
		if(eq.solutions.length === 3){
			solutions.push(...eq.solutions)
		}
		else {
			let fCard = new fCardano(this.coeffs);
			if(eq.solutions.length !== 0){
				solutions.push(...eq.solutions);
				for(let r of fCard.solutions){
					for(let i of eq.solutions){
						if(r.evaluate().toFixed(12) !== i.evaluate().toFixed(12)){
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