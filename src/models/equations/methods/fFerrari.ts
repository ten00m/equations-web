import {Equation} from '../../Equation'
import {parse, simplify} from 'mathjs'

export class fFerrari{
    coeffs: Array<number>;
    solutions: Array<any>;
    stepByStep: Array<any>

    constructor(coeffs: Array<number>, steByStep: Array<any>){
        this.coeffs = coeffs;
        this.stepByStep = steByStep
        this.solutions = this.solve()
    }

    private solve(): Array<any>{
        const le = this.coeffs.at(-1);
        const coeffs: Array<number> = le ? this.coeffs.map(c => c/le) : [];
        const [d, c, b, a] = coeffs.slice(0, -1);
        const roots: Array<any> = []
        const tRoots: Array<any> = []
        
        const pParsed = parse(`${b - 3*a**2/8}`)
        const qParsed = parse(`${a**3/8 - (a*b/2) + c}`);
        const rParsed = parse(`${-(3*a**4/256) + (a**2*b/16) - c*a/4 + d}`);
        const [p, q, r] = [pParsed.evaluate(), qParsed.evaluate(), rParsed.evaluate()]

        this.stepByStep.push([
            "Количество корней меньше четырех, возможны иррациональные корни",
            ""
        ], [
            "Поделим уравнение на старший коэффициент и получим",
            "x^4 + ax^3 + bx^2 + cx + d = 0"
        ], [
            "где",
            String.raw`a = ${a},\\\ b = ${b}, \\\ c = ${c}, \\\ d = ${d}`
        ], [
            "Приведем уравнение к виду",
            "u^4 + pu^2 + qu + r = 0"
        ], [
            "При помощи замены",
            String.raw`x = u - \frac{a}{4}`
        ], [
            'Получим',
            `u^4 + ${simplify(pParsed).toTex()}u^2 + ${simplify(qParsed).toTex()}u + ${simplify(rParsed).toTex()} = 0`
        ])
        
        if(q !== 0){
            const resolvent = `2s^3 - (${p}*s^2) - (2*${r}*s) + ${r*p} - ((${q})^2/4) = 0`;
            const resEq = new Equation(resolvent);

            let [resSol, resStep] = resEq.solve();

            this.stepByStep.push([
                "Решим кубическую резольвенту уравнения 4-ой степени:",
                resEq.equatTree.toTex() + " = 0"
            ], ...resStep)
    
            let s: number | undefined = undefined;

            resSol = resSol.filter((r: any) => {
                return 2*r.evaluate() - p >=0
            });
            console.log(resSol)
            for(let root of resSol){
                const isLastRoot = resSol.indexOf(root) === resSol.length - 1;

                root = parse(Number(root.evaluate().toString()).toFixed(10).toString());

                if(Math.abs(Number(root.toString()))*1000000000 % 1 === 0 
                    || (isLastRoot && !s)){
                    s = Number(root.evaluate())
                }
            }
            if(s === undefined){
                this.stepByStep.push([
                    'Корни кубичской резольвенты, такие что',
                    String.raw`\sqrt{2s - p} \text{ - вещественное число, отсутствуют}`
                ], [
                    'Вещественных корней нет'
                ])
            }else {
                const eq = new Equation(`(u^2 + u*sqrt(${2*s - p}) - ${q}/(2*sqrt(${2*s - p})) + ${s})(u^2 - u*sqrt(${2*s - p}) + ${q}/(2*sqrt(${2*s - p})) + ${s}) = 0`);

                const [eqSol, eqStep] = eq.solve();

                this.stepByStep.push([
                    "  Выберем значение корня кубической резольвенты и подставим в эквивалентное уравнение",
                    String.raw`\displaylines{
                    (u^2 - u\sqrt{2s - p} + \frac{q}{2\sqrt{2s - p}} + s)*\\\
                    *(u^2 + u\sqrt{2s - p} - \frac{q}{2\sqrt{2s - p}} + s) = 0
                    }`
                ], [
                    "Где",
                    `s = ${s}`
                ], [
                    "Получим",
                 eq.equatTree.toTex() + " = 0"
                ], ...eqStep)
            
                tRoots.push(...eqSol);
            }
        } else {

            const quadratic = new Equation(`t^2 + ${p}*t + ${r} = 0`);
            const [qSols, qSteps] = quadratic.solve();

            this.stepByStep.push([
                "Заменим",
                "u^2 = t"
            ], ...qSteps)

            for(let r of qSols){
                this.stepByStep.push([
                    "Обратная замена",
                    String.raw`\displaylines{
                        u^2 = ${r.toTex()}
                    }`
                ])           

                if(r.evaluate() >= 0){
                    tRoots.push(parse(`sqrt(${r.toString()})`), parse(`-sqrt(${r.toString()})`))

                    this.stepByStep.push([
                        "",
                        String.raw`
                            u_{1, 2} = \pm \sqrt[2]{${r.toTex()}}
                        `
                    ])
                } else{
                    this.stepByStep.push([
                        "Уравнение",
                        `u^2 = t, \\\ t< 0`
                    ], ["Не имеет вещественных"])
                }
            }
        }
        roots.push(...tRoots.map((r, n) => {
            this.stepByStep.push([
                "Обратная замена",
                String.raw`x_${n + 1} = u - \frac{a}{4} = ${r.toTex()} - \frac{${a}}{4}`
            ])

            return  parse(`${r} - ${a}/4`)
        }));
        


        return roots
    }
}