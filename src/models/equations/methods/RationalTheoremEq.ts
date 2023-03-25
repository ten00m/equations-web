import {parse, simplify} from 'mathjs' 

export class RationalTheoremEq {
	coeffs: Array<number>;
	tree: any;
	solutions: Array<any>;

	constructor(coeffs: Array<number>, tree: any){
		this.coeffs = coeffs
		this.tree = tree
		this.solutions = this.solve()
	}

	private solve(){
		const solutions: Array<any> = [];
		const evSol: Array<number> = []
		const freeMember = this.coeffs[0];
		const highMember = this.coeffs[this.coeffs.length - 1];
		
		const numerators = this.getDividers(freeMember)
		const denominators = this.getDividers(highMember);

		for(let num of numerators){
			for(let denom of denominators){
				const root = simplify(parse(`${num}/${denom}`));
				const evRoot = root.evaluate()
				if(simplify(this.tree, {x: root}).toString() === '0' && !evSol.includes(evRoot)){
					solutions.push(root);
					evSol.push(root.evaluate())
				}
			}
		}


		return solutions
	}

	private getDividers(number: number){
		number = Math.abs(number)
		const dividers = [];

		for(let i = 1; i <= number; i++){
			if(number % i === 0){
				dividers.push(i);
				dividers.push(-i)
			}
		}

		return dividers
	}
}
