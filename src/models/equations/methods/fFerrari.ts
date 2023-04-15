import {Equation} from '../../Equation'
import {parse} from 'mathjs'

export class fFerrari{
    coeffs: Array<number>;
    solutions: Array<any>;

    constructor(coeffs: Array<number>){
        this.coeffs = coeffs
        this.solutions = this.solve()
    }

    private solve(): Array<any>{
        const le = this.coeffs.at(-1);
        const coeffs: Array<number> = le ? this.coeffs.map(c => c/le) : [];
        const [d, c, b, a] = coeffs.slice(0, -1);
        const roots: Array<any> = []
        const tRoots: Array<any> = []
        
        const p = b - 3*a**2/8;
        const q = a**3/8 - (a*b/2) + c;
        const r = -(3*a**4/256) + (a**2*b/16) - c*a/4 + d;
        
        if(q !== 0){
            const resolvent = `2x^3 - (${p}*x^2) - (2*${r}*x) + ${r*p} - ((${q})^2/4) = 0`;
            const resEq = new Equation(resolvent);
            const resSol = resEq.solve();
    
            let s: number = 0;
    
            for(let root of resSol){
                const isLastRoot = resSol.indexOf(root) === resSol.length - 1;

                root = parse(Number(root.toString()).toFixed(10).toString());

                if(Math.abs(Number(root.toString()))*1000000 % 1 === 0 
                    || (isLastRoot && !s)){
                    s = Number(root.toString())
                }
            }
            
            const quadratic_1 = new Equation(`x^2 + x*sqrt(${2*s - p}) - ${q}/(2*sqrt(${2*s - p})) + ${s} = 0`)
            const quadratic_2 = new Equation(`x^2 - x*sqrt(${2*s - p}) + ${q}/(2*sqrt(${2*s - p})) + ${s} = 0`)
            tRoots.push(...quadratic_1.solve(), ...quadratic_2.solve());
        } else {
            const quadratic = new Equation(`x^2 + ${p}*x + ${r} = 0`);
            const sols = quadratic.solve();
            for(let r of sols){
                if(r.evaluate() >= 0){
                    tRoots.push(parse(`sqrt(${r.toString()})`), parse(`-sqrt(${r.toString()})`))
                } 
            }
        }

        roots.push(...tRoots.map(r => parse(`${r} - ${a}/4`)));
        


        return roots
    }
}