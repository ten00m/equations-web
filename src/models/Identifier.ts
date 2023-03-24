import {simplify} from 'mathjs'

export class Identifier{
	public static preIdent(node: any){
		//node = simplify(node)

		if(!this.checkPoly(node)){
			if(node.op === '*'){
				return 'multipl'
			}
			if(node.op === '/'){
				return 'fraction'
			}
			if(node.op === '^'){
				return 'pow'
			}
		}
		return 'None'
	}

	public static postIdent(node: any){
		if(node.op === '/'){
			return 'rational'
		}
		let pOP = this.checkMaxPow(node, 1); //powOfPolynom
		
		return pOP === 1 
			? 'lineal' :
				pOP === 2 
			? 'quadratic' :
				pOP === 3 
			? 'cubic' :
				pOP === 4
			? 'fourPow' :
				'powNPolynom'
	}

	private static checkPoly(node: any): boolean{
		return node.type !== 'OperatorNode' 
			? false
			: node.op === '+' 
				|| node.op === '-'
	}	

	public static checkMaxPow(node: any, pow: number){
		if(
			node.type === 'ConstantNode' || 
			node.type === 'SymblolNode'
		){
			return pow
		}
		if(
			node?.op === '^' && 
			node?.args[0].type === 'SymbolNode' && 
			node?.args[1].type === 'ConstantNode'
		){
			return pow < node.args[1].value ? node.args[1].value : pow 
		}
		if(node.args){
			for(let arg of node.args){
				let argPow = this.checkMaxPow(arg, pow);
				if(argPow > pow){
					pow = argPow
				}
			}
		}
		return pow
	}
}


// types: multipl(произведение двух выражений), rational(рациональное уравнение), pow(взведение в степень), 
// lineal(линейное), quadratic(квадратное), cubic(кубическое), 
// fourPow(четвертая степень) powNPolynom(уравнение выше четвертой степени)