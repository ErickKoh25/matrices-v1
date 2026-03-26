import type { Matrix } from '../types'

export default function MatrixInput(props: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  parsed?: Matrix | null
  error?: string | null
}) {
  return (
    <div style={{ textAlign: 'left' }}>
      <label style={{ display: 'block' }}>
        {props.label}
        <textarea
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          rows={4}
          style={{ width: '100%', marginTop: 6, padding: 8, fontFamily: 'var(--mono)' }}
        />
      </label>

      {props.error ? (
        <div style={{ color: 'crimson', marginTop: 6 }}>{props.error}</div>
      ) : props.parsed ? (
        <div style={{ color: 'var(--text)', marginTop: 6 }}>
          {props.parsed.length}x{props.parsed[0].length}
        </div>
      ) : null}
    </div>
  )
}

