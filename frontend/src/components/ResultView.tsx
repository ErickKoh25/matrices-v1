export default function ResultView(props: {
  message: string | null
  error: string | null
}) {
  return (
    <div style={{ marginTop: 18 }}>
      {props.error ? (
        <div style={{ color: 'crimson' }}>
          <strong>Error:</strong> {props.error}
        </div>
      ) : props.message ? (
        <div>
          <h2 style={{ marginTop: 0 }}>Resultado</h2>
          <pre
            style={{
              textAlign: 'left',
              background: 'var(--code-bg)',
              border: '1px solid var(--border)',
              padding: 12,
              borderRadius: 8,
              overflowX: 'auto',
            }}
          >
            {props.message}
          </pre>
        </div>
      ) : (
        <div style={{ opacity: 0.8, fontSize: 16 }}>
          Presiona <code>Calcular</code> para validar y previsualizar el payload.
        </div>
      )}
    </div>
  )
}

