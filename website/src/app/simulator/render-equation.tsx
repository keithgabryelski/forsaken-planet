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
          {`$$ {\\color{orange} baseDamage } * \\prod_{a = adjustment_1}^{adjustment_n} AdjustmentPROC({\\color{lightblue} a^{chance}}) \\Rightarrow {\\color{violet} a^{multiplier}}$$`}
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
              {i === array.length - 1 ? "" : "*"}
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
