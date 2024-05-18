import { MathJaxContext, MathJax } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html", "[tex]/color"] },
  tex: {
    packages: { "[+]": ["html", "color"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

export default function RenderEquation({ equation }) {
  return (
    <div>
      <MathJaxContext version={3} config={config}>
        <MathJax hideUntilTypeset={"first"}>
          {`$$\\sum_{a = adjustment_1}^{adjustment_n} f(a, {\\color{orange} baseDamage}, {\\color{yellow} rng})$$`}
        </MathJax>
        <MathJax hideUntilTypeset={"first"}>
          {`$$
                \\begin{eqnarray} \\\

                &&f(a,  {\\color{orange} baseDamage}, {\\color{yellow} rng}) =  \\begin{array} \\\
                {\\color{orange} baseDamage } \\cdot {\\color{violet} a^{multiplier}} &for& {\\color{yellow} \\mathcal{rng}} \\lt {\\color{lightblue} a^{chance}}

                \\end{array} \\\\

                \\end{eqnarray}

                $$`}
        </MathJax>
      </MathJaxContext>
      <div className="flex-column">
        {equation.map((e, i, array) => (
          <div key={i.toString()} className="flex align-content-start">
            <div className="flex align-items-center justify-content-left w-10rem font-bold"></div>
            <div className="flex align-items-center justify-content-left w-20rem font-bold">
              {e.equationFragment}
            </div>
            <div className="flex align-items-center justify-content-left w-10rem font-bold">
              {i === array.length - 1 ? "" : "+"}
            </div>
            <div className="flex align-items-center justify-content-left w-20rem font-bold">
              ({e.equationComment})
            </div>
            <div className="flex align-items-center justify-content-left w-10rem font-bold"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
