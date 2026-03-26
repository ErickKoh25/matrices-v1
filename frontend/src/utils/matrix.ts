import type { Matrix } from '../types'

function assertRectangular(matrix: unknown): Matrix {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error('La matriz no es válida')
  }

  const rows = matrix as unknown[]
  const cols = Array.isArray(rows[0]) ? rows[0].length : 0

  if (cols === 0) {
    throw new Error('La matriz no es válida')
  }

  const parsed: Matrix = rows.map((row) => {
    if (!Array.isArray(row) || row.length !== cols) {
      throw new Error('La matriz no es válida')
    }

    return row.map((v) => {
      const n = typeof v === 'number' ? v : Number(v)
      if (!Number.isFinite(n)) {
        throw new Error('La matriz no es válida')
      }
      return n
    })
  })

  return parsed
}

export function parseMatrixJson(text: string): Matrix {
  const value = JSON.parse(text)
  return assertRectangular(value)
}

export function matrixShape(m: Matrix): { rows: number; cols: number } {
  return { rows: m.length, cols: m[0]?.length ?? 0 }
}

export function isSquare(m: Matrix): boolean {
  const { rows, cols } = matrixShape(m)
  return rows === cols
}

