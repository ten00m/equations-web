import { RationalTheoremEq } from "./methods/RationalTheoremEq";
import { fFerrari } from "./methods/fFerrari";

export class FourPowEq{
    coeffs: Array<number>;
    tree: any;
    solutions: Array<any>;
    stepByStep: Array<any>

    constructor(coeffs: Array<number>, tree: any, stepByStep: Array<any>){
        this.coeffs = coeffs
        this.tree = tree
        this.stepByStep =stepByStep
        this.solutions = this.solve()
    }

    private solve(): Array<any>{
        let eq = new RationalTheoremEq(this.coeffs, this.tree, this.stepByStep, 'x');
		if(eq.solutions.length === 4){
			return eq.solutions
		}
        else {
            let fFer = new fFerrari(this.coeffs, this.stepByStep);

            return fFer.solutions
        }
		
    }
}