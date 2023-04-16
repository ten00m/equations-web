import {parse} from 'mathjs'

export class Quadratic {
	coeffs: Array<number>;
	solutions: Array<any>;
	tree: any
	stepByStep: Array<any>;

	constructor(coeffsArr: Array<number>, stepByStep: Array<any>, tree: any){
		this.coeffs = coeffsArr;
		this.stepByStep = stepByStep;
		this.tree = tree
		this.solutions = this.solve();
	}

	solve(): Array<any>{
		let answers: Array<any> = [];

		const symb = this.tree.toString().includes('x') ? 'x'
			: this.tree.toString().includes('u') ? 'u'
			: 't'
		
		const [a, b, c] = this.coeffs.reverse();
		const d = parse(`(${b})^2 - 4*${a}*${c}`);

		this.stepByStep.push([
			"Квадратное уравнение, находим дискриминант",
			`D = ${d.toTex()} = ${d.evaluate()}`
		]);

		if(d.evaluate() > 0){
			this.stepByStep.push(["" ,`D > 0`])

			const root1 = parse(`-${b}/(2*${a}) + sqrt(${d})/(2*${a})`);
			const root2 = parse(`-${b}/(2*${a}) - sqrt(${d})/(2*${a})`);

			this.stepByStep.push([
				"Корни квадратного уравнения равны:",
				String.raw`${symb}_{1,2} = ${parse(`-${b}/(2*${a})`).toTex()} \pm ${parse(` sqrt(${d.evaluate()})/(2*${a})`).toTex()}`
			])
			answers.push(root1, root2)
		} else if(d.evaluate() === 0){
			this.stepByStep.push(["", "D = 0"])

			const root0 = parse(`-${b}/(2*${a})`);

			this.stepByStep.push([
				"Корень квадратного уравнения равен:",
				String.raw`${symb} = ${root0.toTex()}`
			])

			answers.push(root0)
		} else{
			this.stepByStep.push(["Дискриминант отицательный, вещественных корней нет", ""])
		}

		return answers
	}

}