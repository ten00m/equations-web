import {fraction, format, parse, rationalize, simplify} from 'mathjs'


export class Simplifyer {
	public static evaluate(root: any){
		const node = parse('sqrt(145)');

		node.traverse((node: any) => {
			if(node?.name === 'sqrt' && this.checkIrrational(node)){
				console.log('!!!')
			}	
		})
	}	

	// надо написать взаимодейтсвие с десятичныеми дробями домножаем до целого если количетсво знаков после запятой четное
	// принимает только fraction
	private static checkPeriodic(fract: any): boolean{
		let m = fract.d;

		while(m % 5 === 0){
			m /= 5
		}

		while(m % 2 === 0){
			m /= 2
		}

		return m !== 1

	}


	// принимет ноду 
	private static checkIrrational(sqrt: any): boolean{
		let isIrrational = false
		if(sqrt?.name === 'sqrt' && sqrt?.isFunctionNode){
			let pri = this.getPrimers(sqrt.args[0]);

			for(let el of pri){

				console.log(pri, el )
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
}