import React,{useState, useMemo} from 'react';
import './App.css';
import {Equation} from './models/Equation'
import {MathComponent} from 'mathjax-react'
import {Parser} from './models/utils/Parser'

function App() {
  	let [equationInp, setEquationInp] = useState('');
  	let [parsedTexEq, setParsedTexEq] = useState('');
  	let [solution, setSolution] = useState<Array<any>>([])
  	let parser = new Parser()

  	useMemo(() => {
  			setParsedTexEq(parser.parseTex(equationInp))
  		}, [equationInp]
  	)

  	function solve(): void{
  		const equation = new Equation(equationInp);
  		const sol = equation.solve();
  		if(!sol[0]){
  			sol.push('none')
  		}
  		setSolution(sol)

  	}

  	return (
    	<div className="App">
    		<input 
				type="text" 
				value={equationInp} 
				onChange={(e): void => {setEquationInp(e.target.value)}}
    		/>
    		<button
				onClick={solve}
    		>
				Решить
    		</button>
    		{
    			equationInp
    	 		?  	<MathComponent tex={parsedTexEq} />
    			:	<div></div>
    		}
    		{
    			solution[0] !== 'none'
    			? solution.map((s, n) => 
    				<MathComponent tex={`x_${n + 1} = ${parser.parseTex(s.toString())}`} key={n}/>
    			)
    			: <MathComponent tex={String.raw`x\in\emptyset`} />
    		}				
    	</div>
  	);
}

export default App;
