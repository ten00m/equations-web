import {Equation} from '../Equation'

export class Rational{
	solutions: Array<any>
	tree: any

	constructor(tree: any){
		this.tree = tree
		this.solutions = this.solve()
	}

	private solve(): Array<any>{
		let solutions = []
		const areaOfVariablesStr = this.tree.args[1].toString() + ' = 0';
		const eqStr = this.tree.args[0].toString() + ' = 0';

		const areaOfVariablesEq = new Equation(areaOfVariablesStr);
		const eq = new Equation(eqStr);

		solutions = this.weedOutRoots(eq.solve(), areaOfVariablesEq.solve())

		return solutions
	}

	private weedOutRoots(rootsEq: Array<any>, rootsAOV: Array<any>): Array<any>{
		const rootsAOVFloat = rootsAOV.map(r => r.evaluate())
		const roots = rootsEq.filter(root => 
			!rootsAOVFloat.includes(root.evaluate())
		)


		return roots
	}
}