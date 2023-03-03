import React,{useState, useMemo} from 'react';
import './App.css';
import {Equation} from './models/Equation'
import {MathComponent} from 'mathjax-react'
import {Parser} from './models/utils/Parser'

function App() {
  	let [equationInp, setEquationInp] = useState('');
  	let [parsedTexEq, setParsedTexEq] = useState('');
  	let parser = new Parser()

  	useMemo(() => {
  			setParsedTexEq(parser.parseTex(equationInp))
  		}, [equationInp]
  	)

  	function solve(): void{
  		const equation = new Equation(equationInp);
  		const solution = equation.solve();
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
    	</div>
  	);
}

export default App;
