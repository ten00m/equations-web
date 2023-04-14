import { RationalTheoremEq } from "./methods/RationalTheoremEq";
import { fFerrari } from "./methods/fFerrari";

export class FourPowEq{
    coeffs: Array<number>;
    tree: any;
    solutions: Array<any>;

    constructor(coeffs: Array<number>, tree: any){
        this.coeffs = coeffs
        this.tree = tree
        this.solutions = this.solve()
    }

    private solve(): Array<any>{
        let eq = new RationalTheoremEq(this.coeffs, this.tree);
		if(eq.solutions.length === 4){
			return eq.solutions
		}
        else {
            let fFer = new fFerrari(this.coeffs);

            return fFer.solutions
        }
		
    }
}