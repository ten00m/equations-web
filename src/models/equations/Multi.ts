import {Equation} from '../Equation'
import {Node} from 'mathjs'

export class Multi {
	solutions: Array<any>;
	tree: any;
	stepByStep: Array<any>;

	constructor(equatTree: any, stepByStep: Array<any>){
		this.tree = equatTree;
		this.stepByStep = stepByStep	
		this.solutions = this.solve()
	}

	solve(): any{
		const tree = this.tree
		let solutions: any = [];


		this.stepByStep.push([
			"Уравнение имеет вид:",
			String.raw`f(x)g(x) = 0`
		],[
			"",String.raw`
			\left[
			 {\displaylines{f(x) = 0 \\\ g(x) = 0 }
			 }\right.
			 `
		])

		for(let eq of tree.args){
			if(Equation.isEquation(eq)){
				const underEq = new Equation(eq.toString() + ' = 0');
				const underSolve = underEq.solve()

				this.stepByStep.push(...underSolve[1])

				solutions = [...solutions, ...underSolve[0]]
			}
		}

		return solutions
	}
}