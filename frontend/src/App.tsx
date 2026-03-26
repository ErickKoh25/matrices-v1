import { useMemo, useState } from 'react'

import MatrixInput from './components/MatrixInput'
import OperationSelector from './components/OperationSelector'
import ResultView from './components/ResultView'
import type { Matrix, OperationKind } from './types'
import {
  postDeterminante,
  postEscalar,
  postMultiplicar,
  postResta,
  postSuma,
  postTrasponer,
} from './api/client'
import { isSquare, matrixShape, parseMatrixJson } from './utils/matrix'

const examples = {
  a: '[[1, 2], [3, 4]]',
  b: '[[5, 6], [7, 8]]',
}

function safeParseMatrix(text: string): { parsed: Matrix | null; error: string | null } {
  try {
    return { parsed: parseMatrixJson(text), error: null }
  } catch (e) {
    return { parsed: null, error: e instanceof Error ? e.message : 'Error de parseo' }
  }
}

export default function App() {
  const [operation, setOperation] = useState<OperationKind>('suma')

  const [aText, setAText] = useState(examples.a)
  const [bText, setBText] = useState(examples.b)
  const [escalarText, setEscalarText] = useState('2')

  const [uiError, setUiError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const parsedA = useMemo(() => safeParseMatrix(aText), [aText])
  const parsedB = useMemo(() => safeParseMatrix(bText), [bText])

  const showB = operation === 'suma' || operation === 'resta' || operation === 'multiplicar'

  function formatMatrix(m: Matrix): string {
    return m.map((row) => row.join(', ')).join('\n')
  }

  async function onCalculate() {
    setUiError(null)
    setMessage(null)
    setLoading(true)

    try {
      const A = parseMatrixJson(aText)
      const aShape = matrixShape(A)

      if (operation === 'suma' || operation === 'resta') {
        const B = parseMatrixJson(bText)
        const bShape = matrixShape(B)
        const sameDim = aShape.rows === bShape.rows && aShape.cols === bShape.cols

        if (!sameDim) {
          throw new Error(
            operation === 'suma'
              ? 'Las matrices deben tener la misma dimensión para sumar'
              : 'Las matrices deben tener la misma dimensión para restar',
          )
        }

        const result = operation === 'suma' ? await postSuma(A, B) : await postResta(A, B)
        setMessage(
          `Resultado (${operation}):\n${formatMatrix(result)}\n\nDimensiones: ${aShape.rows}x${aShape.cols}`,
        )
        return
      }

      if (operation === 'multiplicar') {
        const B = parseMatrixJson(bText)
        const bShape = matrixShape(B)
        if (aShape.cols !== bShape.rows) {
          throw new Error('Número de columnas de A debe ser igual al número de filas de B')
        }

        const result = await postMultiplicar(A, B)
        setMessage(
          `Resultado (multiplicar):\n${formatMatrix(result)}\n\nDimensiones: ${aShape.rows}x${bShape.cols}`,
        )
        return
      }

      if (operation === 'escalar') {
        const k = Number(escalarText)
        if (!Number.isFinite(k)) {
          throw new Error('Escalar inválido')
        }
        const result = await postEscalar(A, k)
        setMessage(
          `Resultado (escalar):\n${formatMatrix(result)}\n\nDimensiones: ${aShape.rows}x${aShape.cols}\nEscalar: ${k}`,
        )
        return
      }

      if (operation === 'trasponer') {
        const result = await postTrasponer(A)
        const resShape = matrixShape(result)
        setMessage(
          `Resultado (trasponer):\n${formatMatrix(result)}\n\nDimensiones: ${resShape.rows}x${resShape.cols}`,
        )
        return
      }

      if (operation === 'determinante') {
        if (!isSquare(A)) {
          throw new Error('El determinante sólo existe para matrices cuadradas')
        }
        const det = await postDeterminante(A)
        setMessage(`Determinante: ${det}`)
        return
      }
    } catch (e) {
      setUiError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Calculadora de Matrices</h1>

      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <OperationSelector value={operation} onChange={setOperation} />

        <div style={{ marginTop: 18, textAlign: 'left' }}>
          <MatrixInput
            label="Matriz A (JSON number[][])"
            value={aText}
            onChange={setAText}
            placeholder={examples.a}
            parsed={parsedA.parsed}
            error={parsedA.error}
          />

          {showB ? (
            <div style={{ marginTop: 18 }}>
              <MatrixInput
                label={operation === 'multiplicar' ? 'Matriz B (JSON number[][])' : 'Matriz B (JSON number[][])'}
                value={bText}
                onChange={setBText}
                placeholder={examples.b}
                parsed={parsedB.parsed}
                error={parsedB.error}
              />
            </div>
          ) : null}

          {operation === 'escalar' ? (
            <label style={{ display: 'block', marginTop: 18 }}>
              Escalar
              <input
                type="number"
                value={escalarText}
                onChange={(e) => setEscalarText(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 6 }}
              />
            </label>
          ) : null}

          <button
            onClick={() => void onCalculate()}
            style={{
              width: '100%',
              marginTop: 18,
              padding: 12,
              borderRadius: 8,
              border: '1px solid var(--accent-border)',
              background: 'var(--accent-bg)',
              color: 'var(--text-h)',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Calculando...' : 'Calcular'}
          </button>

          <ResultView message={message} error={uiError} />
        </div>
      </div>
    </div>
  )
}
