import {Equation} from '../Equation'

export class Rational{
	solutions: Array<any>
	tree: any
	stepByStep: Array<any>

	constructor(tree: any, stepByStep: Array<any>){
		this.tree = tree
		this.stepByStep = stepByStep
		this.solutions = this.solve()
	}

	private solve(): Array<any>{
		let solutions = [];
		this.stepByStep.push([
			"Уравнение имеет вид",
			String.raw`\frac{f(x)}{g(x)} = 0`
		],[
			"", String.raw`
				\left\{{
					\displaylines{f(x) = 0 \\\ g(x) \neq 0}
				}\right.
			`
		])
		const areaOfVariablesTree = this.tree.args[1];
		const eqTree = this.tree.args[0];

		this.stepByStep.push([
			"Область допустимых значений:",
			String.raw`${areaOfVariablesTree} \neq 0`
		])

		const areaOfVariablesEq = new Equation(areaOfVariablesTree.toString() + ' = 0');
		const AOVsolut = areaOfVariablesEq.solve();

		for(let i = 1; i <= AOVsolut[0].length; i++){
			this.stepByStep.push([
				"",
				String.raw`x_{${i}} \neq ${AOVsolut[0][i-1].toTex()}`
			])
		}

		const eq = new Equation(eqTree.toString() + ' = 0');
		const eqSol = eq.solve();

		this.stepByStep.push([
			"Решаем уравнение в числителе",
			eqTree.toTex() + " = 0"
		], 
		...eqSol[1],
			[
			"Отсекаем корни, не входящие в ОДЗ",
			""
		])

		solutions = this.weedOutRoots(eqSol[0], AOVsolut[0])

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