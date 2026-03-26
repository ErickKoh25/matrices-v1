import type { OperationKind } from '../types'

const operations: Array<{ kind: OperationKind; label: string }> = [
  { kind: 'suma', label: 'Suma' },
  { kind: 'resta', label: 'Resta' },
  { kind: 'escalar', label: 'Producto escalar' },
  { kind: 'multiplicar', label: 'Producto de matrices' },
  { kind: 'trasponer', label: 'Trasponer' },
  { kind: 'determinante', label: 'Determinante' },
]

export default function OperationSelector(props: {
  value: OperationKind
  onChange: (v: OperationKind) => void
}) {
  return (
    <label style={{ display: 'block', textAlign: 'left' }}>
      Operación
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value as OperationKind)}
        style={{ width: '100%', padding: 8, marginTop: 6 }}
      >
        {operations.map((op) => (
          <option key={op.kind} value={op.kind}>
            {op.label}
          </option>
        ))}
      </select>
    </label>
  )
}

