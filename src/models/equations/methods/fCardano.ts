import {parse, evaluate} from 'mathjs'


export class fCardano{
    coeffs: Array<number>;
    solutions: Array<any>;

    constructor(coeffs: Array<number>){
        this.coeffs = coeffs
        this.solutions = this.solve()
    }

    private solve(): Array<any>{
        let [d, c, b, a] = [...this.coeffs];
        if(a !== 1){
            [d, c, b, a] = [...this.coeffs.map(coef => coef/a)]
        }

        const p = (3*a*c - b*b)/(3*a*a)
        const q = evaluate(`(2*${b}^3 - 9 * ${a}*${b}*${c} + 27 * (${a}^2) * ${d}) / 27 * ${a}^3`)
        const Q = parse(`(${p} / 3)^3 + (${q} / 2)^2`);

        const roots: Array<number> = []

        if (Q.evaluate() < 0){
            let fi
            if(q < 0){
                fi = Math.atan(Math.sqrt(-Q.evaluate())/ -(q / 2))
            } else if(q > 0){
                fi = Math.atan(Math.sqrt(-Q.evaluate())/ -(q / 2)) + Math.PI
            } else {
                fi = Math.PI/2
            }
            for(let k = 0; k < 3; k++){
                const tRoot = 2*Math.sqrt(-p/3)*Math.cos(fi/3 + k*2*Math.PI/3)
                const root = tRoot - b/(3*a)
                roots.push(root)
            }
        } else if(Q.evaluate() > 0){
            const tRoot = Math.cbrt(-q/2 + Math.sqrt(Q.evaluate())) + Math.cbrt(-q/2 - Math.sqrt(Q.evaluate()));
            const root = tRoot - b/(3*a)
            roots.push(root)
        } else {
            const root_1 = 2*Math.cbrt(-q/2) - b/(3*a);
            const root_2 = -Math.cbrt(-q/2) - b/(3*a);
            roots.push(root_1, root_2)

        }
        
        
        return roots.map(root => parse(root.toString()))
    }
}