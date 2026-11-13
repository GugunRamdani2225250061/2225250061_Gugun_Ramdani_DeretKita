const A = () => <span className="sim sim-a">a</span>
const R = () => <span className="sim sim-r">r</span>
const N = () => <span className="sim sim-n">n</span>

export default function Rumus({ nama }) {
  if (nama === 'Un') {
    return (
      <div className="rumus" aria-label="U n sama dengan a kali r pangkat n kurang 1">
        U<sub><N /></sub> = <A /> · <R /><sup>(<N /> − 1)</sup>
      </div>
    )
  }
  if (nama === 'Sn') {
    return (
      <div className="rumus" aria-label="S n sama dengan a kali r pangkat n kurang 1, dibagi r kurang 1">
        S<sub><N /></sub> =
        <span className="pecahan">
          <span><A />(<R /><sup><N /></sup> − 1)</span>
          <span><R /> − 1</span>
        </span>
      </div>
    )
  }
  if (nama === 'r') {
    return <div className="rumus"><R /> = U<sub>2</sub> : U<sub>1</sub> = U<sub>3</sub> : U<sub>2</sub></div>
  }
  return <div className="rumus">{nama}</div>
}
