import React,{useState, useMemo} from 'react';
import './App.css';
import {Equation} from './models/Equation'
import {Parser} from './models/utils/Parser'
import LiveInp from './components/liveinp/LiveInp'
import LatexOut from './components/latexout/LatexOut';
import EquatInp from './components/equatInp/EquatInp';
import Header from './components/header/Header'
import StepByStep from './components/stepByStep/SteByStep';

function App() {
  	let [equationInp, setEquationInp] = useState('Enter your equation');
  	let [parsedTexEq, setParsedTexEq] = useState('');
  	let [solution, setSolution] = useState<Array<any>>([]);
	let [step, setStep] = useState<Array<any>>([])
  	let parser = new Parser()

  	useMemo(() => {
			const parsed = parser.parseTex(equationInp)
  			if(parsed){
				setParsedTexEq(parsed)
			}
			if(solution){
				setSolution([])
				setStep([])
			}
  		}, [equationInp]
  	)

  	function solve(): void{
  		const equation = new Equation(equationInp);
  		const [sol, stBySt] = equation.solve();

		setStep(stBySt)
  		if(!sol[0]){
  			sol.push('none')
  		}
  		setSolution(sol)

  	}

	function getParsedSol(s: any){
		return parser.parseTex(s.toString())
	}

  	return (
    	<div className="App">
			<div className="wrapper">
				<Header/>
				<EquatInp solve={solve} setEquationInp={setEquationInp} equatStr={equationInp}/>
				<div className="out">
					<LiveInp equatStr={equationInp} parsedTexEq={parsedTexEq}/>
					<LatexOut getParsedSol={getParsedSol} solution={solution}/>
					<StepByStep stepArr={step} solutions={solution} getParsedSol={getParsedSol}/>
				</div>	
			</div>
    	</div>
  	);
}

export default App;
