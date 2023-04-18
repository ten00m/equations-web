import {fraction, format, parse, rationalize, simplify} from 'mathjs'


export class Simplifyer {

	public static evaluate(root: any){
		root = root.transform((node: any) => {
			if(node?.name === 'sqrt' && node.isFunctionNode){
				if(node.args[0].op === '/'){
					const [p, q] = node.args[0].args;
					const numerator = this.evaluate(parse(`sqrt(${p})`));
					const denominator = this.evaluate(parse(`sqrt(${q})`));
					return parse(`${numerator}/${denominator}`)
				}
				const expr = rationalize(node.args[0])
				const sqrt = parse(`sqrt(${expr})`)
				if(this.checkIrrational(sqrt)){
					return this.partialExt(sqrt)
				}
			}

			return node
		})


		const [transformed, sqrtExps] = this.replace(root);
		const rules = [
			...simplify.rules, 
			'-(n1 + n2) -> -n1 - n2',
			'n1/n3 + n2/n3 -> (n1 + n2)/n3'
		]

		let simplified = simplify(transformed, rules);

		simplified = this.revReplace(simplified, sqrtExps)

		return simplified

	}	

	// принимет ноду 
	private static checkIrrational(sqrt: any): boolean{
		let isIrrational = false
		if(sqrt?.name === 'sqrt' && sqrt?.isFunctionNode){
			let pri = this.getPrimers(sqrt.args[0]);

			for(let el of pri){

				if((pri.lastIndexOf(el) + 1) % 2 !== 0){
					isIrrational = true
				}

				const ind = -(pri.length - pri.lastIndexOf(el)) + 1
				pri = pri.slice(ind)
			}
		}
		return isIrrational
	}

	private static getPrimers(number: number): Array<number>{
		const primers: Array<number> = []
		for(let i = 2; i <= number; i++){
			while(number % i === 0){
				number /= i
				primers.push(i)
			}
		}

		return primers
	}

	private static replace(root: any): any{
		const sqrtExps: Array<number> = [] //массив с подкоренными выражениями, выражения соответствуют y^n где n = индекс данного выражения + 1
		let n = 0
		
		const transformed = root.transform((node: any) => {
			if(node?.name === 'sqrt' && node.isFunctionNode){
				let sqrtExp = node.args[0];
				sqrtExp = rationalize(sqrtExp);
				sqrtExp = sqrtExp?.value ? sqrtExp?.value : 0
				if(this.checkIrrational(node)){
					if(sqrtExps.indexOf(sqrtExp) === -1){
						sqrtExps.push(sqrtExp);
					}

					n = sqrtExps.indexOf(sqrtExp) + 2

					return parse(`y^${n}`)
				}
			}

			return node
		})

		return [transformed, sqrtExps]
	}

	// возвращает частично извлеченный корень 
	private static partialExt(sqrt: any): any{
		let mod = 1;
		let mult = 1
		let sqrtExp: any = rationalize(sqrt.args[0]);
		sqrtExp = sqrtExp?.value ? sqrtExp?.value : 0;
		let primersOfExp = this.getPrimers(sqrtExp);

		for(let el of primersOfExp){
			const lastInd = primersOfExp.lastIndexOf(el);
			if(lastInd + 1 === primersOfExp.length){

			}

			if((lastInd + 1) % 2 !== 0){
				mod *= el;
				mult *= el**(lastInd / 2)
			} else {
				mult *= el**((lastInd + 1) / 2)
			}

			if(lastInd + 1 === primersOfExp.length){
				break
			}
			const ind = -(primersOfExp.length - lastInd) + 1
			primersOfExp = primersOfExp.slice(ind)
		}

		return parse(`${mult}*sqrt(${mod})`)
	}

	private static revReplace(node: any, sqrtExps: Array<number>): any{
		const transformed = node.transform((node: any) => {
			if(node?.op === '^'){
				const n = node.args[1]?.value - 2
				const sqrtExp = sqrtExps[n]

				return parse(`sqrt(${sqrtExp})`)
			}

			return node
		})

		return transformed
	}
}