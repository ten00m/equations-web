import {parse} from 'mathjs'

export class Parser {
	tree: Object;

	constructor(){
		this.tree = {}
	}


	// парсит выражения для вывода тех
	public parseTex(equat: string): string{
		let equatTex = '';
		try{
			if(equat.indexOf('=') !== -1){
				let pos = equat.indexOf('=');
				equatTex = parse(equat.slice(0, pos)).toTex() + '=' + parse(equat.slice(pos + 1)).toTex() 
			}else{
				equatTex = parse(equat).toTex()
			}
		}catch(Erorr){}

		return equatTex
	}

	public parseEquat(equat: string): any{
		if(this.checkBrackets(equat)){
			equat = this.toNull(equat)
			this.tree = this.getTree(equat);
			return [equat, this.tree]
		} else {
			return 'error'
		}

	}

	private  getTree(equat: string): any{
		const tree = parse(equat);
		return tree
	}



	private toNull(equat: string): string{
		equat = equat.replaceAll(' ', '') + ' ';
		
		const equalInd = equat.search('=');
		if (equat[equalInd + 1] === '0'){
			equat = `${equat.slice(0, equalInd)}`
		} else {
			equat = `${equat.slice(0, equalInd)}-(${equat.slice(equalInd + 1, -1)})`
		}
		return equat;
	}

	private  checkBrackets(equat: string): boolean{
		let stack: Array<number> = [];
		for (let i = 0;  i < equat.length; i++) {

			let letter = equat[i];

			if(letter === '('){
				stack.push(1);
			} else if(letter === ')'){
				if(!stack){
					return false
				}
				stack.pop()
			}
		}

		return !stack.length;
	}
}
