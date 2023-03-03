import {fraction, format, parse, rationalize} from 'mathjs'

export class Simplifyer {
	public static evaluate(root: any){
		console.log(this.checkIrrational(parse('sqrt(144)')))
	}	

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

	private static checkIrrational(sqrt: any): boolean{
		let isIrrational = false
		if(sqrt?.name === 'sqrt'){
			const sqrtEval = sqrt.evaluate().toFixed(100);
			const arg = sqrt.args[0].value;
			console.log(sqrtEval * sqrtEval , arg);
			isIrrational = sqrtEval * sqrtEval !== arg

		}
		return isIrrational
	}
}