import {Parser} from './utils/Parser'
import {simplify, rationalize, Node, OperatorNode, parse, fraction, ConstantNode} from 'mathjs'
import {Identifier} from './Identifier'
import {Lineal} from './equations/Lineal'
import {Quadratic} from './equations/Quadratic'
import {Multi} from './equations/Multi'
import {Rational} from './equations/Rational'
import {CubicEq} from './equations/CubicEq'
import {FourPowEq} from './equations/FourPowEq'
import { PowNEq } from './equations/PowNEq'
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

	public solve(): Array<any>{
		const parser = new Parser();

		const preKind = Identifier.preIdent(this.equatTree);
		let solution: Array<any> = [];
		let coeffs: Array<number> = [];

		const stepByStep:Array<any> = [
			{'prev': this.equatTree.toTex() + '= 0'},
		];

		if((
			this.equatTree?.op === '*' 
			&& this.equatTree.args[0].isConstantNode 
			&& this.equatTree.args[1].isSymbolNode
			)
			|| this.equatTree.isSymbolNode
		){
			solution.push(new ConstantNode(0))
		} else {

			if(preKind === 'multipl'){
				solution = this.getMulti(stepByStep)
			} else {	
				const tree = this.simple();

				stepByStep.push({'simlpledTex': tree.toTex()})
				const postKind = Identifier.postIdent(tree);	
				coeffs = this.getCoeffs(tree); 
				switch(postKind){
					case 'lineal':
						solution = this.getLineal(coeffs, stepByStep);
						break;
					case 'quadratic':
						solution = this.getQuadratic(coeffs, stepByStep);
						break;
					case 'rational':
						solution = this.getRational(stepByStep);
						break;
					case 'cubic':
						solution = this.getCubic(coeffs, tree, stepByStep);
						break;
					case 'fourPow':
						solution = this.getFourPowEq(coeffs, tree, stepByStep);
						break;
					case 'powNPolynom':
						solution = this.getPowNEq(coeffs, tree, stepByStep)
				}
				
			}			
		}

		solution = this.simplifyRoots(solution);

		if(solution.length === 0){
			stepByStep.splice(0)
		}

		console.log(stepByStep)

		return [solution, stepByStep]
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
			if(coeffs.length !== i + 1){
				coeffs.push(0)
			}
		}
		return coeffs
	}

	private getLineal(coeffs: Array<number>, stepByStep: Array<any>){
		let linealEq = new Lineal(coeffs);
		stepByStep.push({'lineal': this.equatTree.toTex() + '= 0'});
		return linealEq.solutions
	}

	private getQuadratic(coeffs: Array<number>, stepByStep: Array<any>){
		let quadraticEq = new Quadratic(coeffs);
		stepByStep.push({'quad': this.equatTree.toTex() + '= 0'})
		return quadraticEq.solutions
	}

	private simplifyRoots(roots: Array<any>): Array<any>{
		let solutions = [];
		for(let root of roots){
			solutions.push(Simplifyer.evaluate(root));
		}

		return solutions
	}

	private getMulti(stepByStep: Array<any>): Array<any> {
		const multiEq = new Multi(this.equatTree)

		return multiEq.solutions
	}

	private getRational(stepByStep: Array<any>): Array<any>{
		const ratEq = new Rational(this.equatTree)

		return ratEq.solutions
	}

	private getCubic(coeffs: Array<number>, tree: any, stepByStep: Array<any>): Array<any>{
		const CubEq = new CubicEq(coeffs, tree);

		return CubEq.solutions
	}

	private getFourPowEq(coeffs: Array<number>, tree: any, stepByStep: Array<any>){
		const fourPowEq = new FourPowEq(coeffs, tree);

		return fourPowEq.solutions
	}

	private getPowNEq(coeffs: Array<number>, tree: any, stepByStep: Array<any>){
		const powNEq = new PowNEq(coeffs, tree);

		return powNEq.solutions
	}

	public static isEquation(tree: any): boolean{
		return true
	}
}