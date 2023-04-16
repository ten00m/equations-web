import { RationalTheoremEq } from "./methods/RationalTheoremEq";

export class PowNEq{
    coeffs: Array<number>
	tree: any;
	solutions: Array<any>
	stepByStep: Array<any>

	constructor(coeffs: Array<any>, tree: any,  stepByStep: Array<any>){
		this.coeffs = coeffs
		this.tree = tree
		this.stepByStep = stepByStep
		this.solutions = this.solve()
	}

	private solve(): Array<any>{
		let eq = new RationalTheoremEq(this.coeffs, this.tree, this.stepByStep, 'x');

        return eq.solutions     
	}
}