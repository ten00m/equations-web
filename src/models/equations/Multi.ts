import {Equation} from '../Equation'
import {Node} from 'mathjs'

export class Multi {
	solutions: Array<any>
	tree: any

	constructor(equatTree: any){
		this.tree = equatTree	
		this.solutions = this.solve()
	}

	solve(): any{
		const tree = this.tree
		let solutions: any = []


		for(let eq of tree.args){
			if(Equation.isEquation(eq)){
				const underEq = new Equation(eq.toString() + ' = 0')
				solutions = [...solutions, ...underEq.solve()]
			}
		}
		console.log(solutions)

		return solutions
	}
}