import {RationalTheoremEq} from './methods/RationalTheoremEq'

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
		if(eq.solutions.length === 3){
			return eq.solutions
		}
		console.log(eq.solutions)
		return []
	}
}