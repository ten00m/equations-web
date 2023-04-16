import {parse, evaluate, simplify} from 'mathjs'


export class fCardano{
    coeffs: Array<number>;
    solutions: Array<any>;
    stepByStep: Array<any>;
    symb: string

    constructor(coeffs: Array<number>, stepByStep: Array<any>, symb: string){
        this.coeffs = coeffs;
        this.stepByStep = stepByStep;
        this.symb = symb
        this.solutions = this.solve()
    }

    private solve(): Array<any>{

        let [d, c, b, a] = [...this.coeffs];

        if(a !== 1){
            [d, c, b, a] = [...this.coeffs.map(coef => coef/a)]
        }


        const p = parse(`(3*${a*c} - ${b*b})/(3*${a*a})`)
        const q = parse(`(2*${b}^3 - 9 * ${a}*${b}*${c} + 27 * (${a}^2) * ${d}) / 27 * ${a}^3`)
        const Q = parse(`(${p} / 3)^3 + (${q} / 2)^2`);

        this.stepByStep.push([
            "Приведем уравнение к виду",
            parse("t^3 + pt + q").toTex() + " = 0 "
        ], [
            "Заменив",
            String.raw`${this.symb} = t - \frac{b}{3a}`
        ],[
            "Получаем кубическое уравнение в каноническом виде",
            parse(`t^3 + ${simplify(p)}t + ${simplify(q)}`).toTex() + '= 0'
        ],[
            "Находим дискриминант кубического уравнения",
            `Q = ${parse(`(p/3)^3 + (q/2)^2`).toTex()}`
        ], [
            "",
            `Q = ${simplify(Q).toTex()}`
        ])

        const roots: Array<number> = []

        if (Q.evaluate() < 0){
            let fi;
            let fiFormula;
            if(q.evaluate() < 0){

                fi = Math.atan(Math.sqrt(-Q.evaluate())/ -(q.evaluate() / 2));
                fiFormula = String.raw`\phi = \arctan{ \Big(\frac{\sqrt{-Q}} {-\frac{q}{2}}\Big) }`
            } else if(q.evaluate() > 0){

                fi = Math.atan(Math.sqrt(-Q.evaluate())/ -(q.evaluate() / 2)) + Math.PI;
            } else {

                fi = Math.PI/2;
            }

            this.stepByStep.push([
                "",
                "Q < 0"
            ], [
                "Находим корни по формуле Кардано",
                String.raw`t_{1,2,3} = 2\sqrt{-\frac{p}{3}}*\cos{\Big(\frac{\phi}{3} + \frac{2\pi k}{3}\Big)},`
            ],[
                "где",
                String.raw`k = 0,1,2`
            ], [
                "",
                fiFormula
            ])

            for(let k = 0; k < 3; k++){

                const tRoot = 2*Math.sqrt(-p.evaluate()/3)*Math.cos(fi/3 + k*2*Math.PI/3)
                const root = tRoot - b/(3*a);

                this.stepByStep.push([
                    "",
                    `t_{${k + 1}} = ${tRoot}`
                ], [
                    "Обратная замена",
                    String.raw`${this.symb}_{${k + 1}} = t - \frac{b}{3a} = ${root}`
                ])

                roots.push(root)
            }

        } else if(Q.evaluate() > 0){

            const tRoot = Math.cbrt(-q.evaluate()/2 + Math.sqrt(Q.evaluate())) + Math.cbrt(-q.evaluate()/2 - Math.sqrt(Q.evaluate()));
            const root = tRoot - b/(3*a);

            this.stepByStep.push([
                "",
                "Q > 0"
            ],[
                "Находим вещественный корень по формуле",
                String.raw`t_{1} = \sqrt[3]{-\frac{q}{2} + \sqrt{Q}} + \sqrt[3]{-\frac{q}{2} - \sqrt{Q}}`
            ], [
                "Получаем",
                `t_{1} = ${tRoot}`
            ], [
                "Обратная замена",
                String.raw`${this.symb} =  t - \frac{b}{3a} = ${tRoot} - \frac{${b}}{3*${a}}`
            ])

            roots.push(root)
        } else {
            const root_1 = 2*Math.cbrt(-q.evaluate()/2) - b/(3*a);
            const root_2 = -Math.cbrt(-q.evaluate()/2) - b/(3*a);

            this.stepByStep.push([
                "Находим корни уравнения по формулам",
                String.raw`t_{1} = 2\sqrt[3]{-\frac{q}{2}}`
            ],[
                "",
                String.raw`t_{2} = -\sqrt[3]{-\frac{q}{2}}`
            ],[
                "Обратно заменив, получаем",
                String.raw`${this.symb}_{1} = ${root_1}`
            ], [
                "",
                String.raw`${this.symb}_{2} = ${root_2}`
            ])

            roots.push(root_1, root_2)

        }
        
        
        return roots.map(root => parse(root.toString()))
    }
}