import {parse, simplify} from 'mathjs' 

export class RationalTheoremEq {
	coeffs: Array<number>;
	tree: any;
	symb: string;
	solutions: Array<any>;
	stepByStep: Array<any>

	constructor(coeffs: Array<number>, tree: any, stepByStep: Array<any>, symb: string){
		this.coeffs = coeffs
		this.tree = tree;
		this.symb = symb
		this.stepByStep = stepByStep
		this.solutions = this.solve()
	}

	private solve(){
		this.stepByStep.push([
			"Подбираем корни с помощью теоремы о рациональных корнях",
			""
		])

		const solutions: Array<any> = [];
		const evSol: Array<number> = []
		const freeMember = this.coeffs[0];
		const highMember = this.coeffs[this.coeffs.length - 1];
		
		const numerators = this.getDividers(freeMember)
		const denominators = this.getDividers(highMember);


		
		for(let num of numerators){
			for(let denom of denominators){

				const root = simplify(parse(`${num}/${denom}`));
				const evRoot = root.evaluate();

				if(simplify(this.tree, {[this.symb]: root}).toString() === '0' && !evSol.includes(evRoot)){
					solutions.push(root);

					this.stepByStep.push([
						"",
						`${this.symb} = ${root.toTex()}`
					])

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
				dividers.push(i, -i);
			}
		}

		return dividers
	}
}
