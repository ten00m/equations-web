import {Parser} from './utils/Parser'
import {simplify, rationalize, Node, OperatorNode, parse, fraction} from 'mathjs'
import {Identifier} from './Identifier'
import {Lineal} from './equations/Lineal'
import {Quadratic} from './equations/Quadratic'
import {Simplifyer} from './utils/Simplifyer'



export class Equation {
	equatStr: string;
	equatTree: any;
	maxPow: number;

	constructor(equatStr: string){
		const parser = new Parser();
		this.maxPow = 0;
		[this.equatStr, this.equatTree] = parser.parseEquat(equatStr.toLowerCase());

	}

	public solve(): Array<number>{
		const preKind = Identifier.preIdent(this.equatTree);
		let solution: Array<any> = []
		let coeffs: Array<number> = []

		if(preKind === 'multipl'){

		} else {	
			const tree = this.simple();
			const postKind = Identifier.postIdent(tree);	
			coeffs = this.getCoeffs(tree); 

			switch(postKind){
				case 'lineal':
					solution = this.getLineal(coeffs);
					break;
				case 'quadratic':
					solution = this.getQuadratic(coeffs)
			}
			
		}
		console.log(solution[0].toString())
		solution = this.simplifyRoots(solution)

		return solution
	}

	private simple(): any {
		let tree = this.equatTree.cloneDeep();
		tree = rationalize(tree);
		return tree
	}

	private getCoeffs(node: OperatorNode): Array<number>{
		this.maxPow = Identifier.checkMaxPow(node, 1);
		let coeffs: Array<number> = []
		for(let i = 0; i <= this.maxPow; i++){
			node.traverse((node: any, path: string, parent: any) => {
				let coeff;
				if(i === 0){
					if(
						node.type === 'ConstantNode' && 
						(
							parent?.op === '+' || 
							parent?.op === '-'
						)
					){	
						if(parent.op === '-'){
							coeffs.push(-node.value)
						} 
						else {
							coeffs.push(node.value)
						}
					}
				} 
				else if(i === 1){
					if(node?.op === '*' && node?.args[1].type === 'SymbolNode'){
						
						if(parent.op === '-' && parent.args[1] === node){
							coeff = -node.args[0].value
						} else {
							coeff = node.args[0].value
						}
						coeffs.push(coeff);
					}
					if(node.type === 'SymbolNode'){
						if((parent?.op === '-' && parent.args[1] === node) || (parent?.fn === 'unaryMinus')){
							coeff = -1
						} else if((parent?.op === '+') ||( parent?.op === '-' && parent?.args[0] === node)){
							coeff = 1
						}
						if(coeff) coeffs.push(coeff)
					}

				} 
				else if(
					node?.op === '*' && 
					node?.args[0].type === 'ConstantNode' &&
					node?.args[1]?.op === '^' &&
					node?.args[1]?.args[0].type === 'SymbolNode' &&
					node?.args[1]?.args[1].value === i   
				){
					if((parent.op === '-' && parent.args[1] === node) || parent.fn === 'unaryMinus'){
						coeff = -node.args[0].value
					} else {
						coeff = node.args[0].value
					}
					coeffs.push(coeff)
				}
				else if(
					node?.op === '^' &&
					node?.args[0].type === 'SymbolNode' &&
					node?.args[1].value === i
				){
					if((parent.op === '-' && parent.args[1] === node) || parent.fn === 'unaryMinus'){
						coeff = -1
					} else if(parent.op === '+' || parent.args[0] === node){
						coeff = 1
					}
					if(coeff) coeffs.push(coeff)
				}
			})
			if(coeffs.length != i + 1){
				coeffs.push(0)
			}
		}
		console.log(coeffs, this.maxPow)
		return coeffs
	}

	private getLineal(coeffs: Array<number>){
		let linealEq = new Lineal(coeffs);
		return linealEq.solutions
	}

	private getQuadratic(coeffs: Array<number>){
		let quadraticEq = new Quadratic(coeffs);
		return quadraticEq.solutions
	}

	private simplifyRoots(roots: Array<any>): Array<any>{
		let solutions = [];
		for(let root of roots){
			solutions.push(Simplifyer.evaluate(root));
		}

		return solutions
	}
}