import { RationalTheoremEq } from "./methods/RationalTheoremEq";

export class PowNEq{
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

        return eq.solutions     
	}
}