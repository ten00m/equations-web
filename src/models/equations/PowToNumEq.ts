import { Equation } from "../Equation";
import { rationalize } from "mathjs";

export class PowToNumEq{
    tree: any;
    solutions: Array<any>;
    stebByStep: Array<any>

    constructor(tree: any, stepByStep: Array<any>){
        this.tree = tree
        this.stebByStep = stepByStep
        this.solutions = this.solve()
    }

    solve(): Array<any> {
        const solution: Array<any> = []
        this.stebByStep.push([
            "Уравнение имеет вид",
            String.raw`(f(x))^n = a`
        ],[
            "",
            String.raw`f(x) = \sqrt[n]{a}`
        ]);


        if(this.tree?.args[0]?.op === '^'){
            if(this.tree?.args[0]?.args[1].value === 2 
                && this.tree?.args[0]?.args[0].isParenthesisNode
            ){
                this.stebByStep.splice(0);

                console.log(this.tree)
                const eq = new Equation(rationalize(this.tree).toString() + ' = 0');
                const solve = eq.solve();

                this.stebByStep.push(...solve[1])
                solution.push(...solve[0])
            } else {
                const left = this.tree.args[0];
                const right = this.tree.args[1];
                const ev = rationalize(right).evaluate()
                const n = left.args[1].value;

                this.stebByStep.push([
                    `Извлечем крень степени ${n} из уравнения`,
                    String.raw`\sqrt[${n}]{${left.toTex()}} = \sqrt[${n}]{${right.toTex()}}`
                ], [
                    "Получим",
                    String.raw`${left.args[0].toTex()} = ${ev > 0 ? ev**(1/n) : -((-(ev))**(1/n))}`
                ])
                console.log(this.tree.toString())
                const eq = new Equation(`${left.args[0].toString()} = ${ev > 0 ? ev**(1/n) : -((-(ev))**(1/n))}`);
                
                const solve = eq.solve();

                this.stebByStep.push(...solve[1]);
                solution.push(...solve[0])
            }
        } else {
            const eqStr = this.tree.args[0].toString();

            const eq = new Equation(`${eqStr} = 0`);
            const [sol, stepByStep] = eq.solve();

            this.stebByStep.push([
                '',
                String.raw`${eqStr} = \sqrt[n]{0}`
            ],
                ...stepByStep);

            solution.push(...sol);
        }
        console.log(solution)
        return solution
    }
}