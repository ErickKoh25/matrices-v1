import type { Matrix } from '../types'

const API_BASE_URL =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000'

type ApiError = { error: string }

async function postJson<TResponse>(path: string, payload: unknown): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as ApiError | null
    throw new Error(err?.error ?? `Error HTTP ${res.status}`)
  }

  return (await res.json()) as TResponse
}

export async function postSuma(m1: Matrix, m2: Matrix): Promise<Matrix> {
  const r = await postJson<{ result: Matrix }>('/api/suma', { m1, m2 })
  return r.result
}

export async function postResta(m1: Matrix, m2: Matrix): Promise<Matrix> {
  const r = await postJson<{ result: Matrix }>('/api/resta', { m1, m2 })
  return r.result
}

export async function postEscalar(m: Matrix, escalar: number): Promise<Matrix> {
  const r = await postJson<{ result: Matrix }>('/api/escalar', { m, escalar })
  return r.result
}

export async function postMultiplicar(a: Matrix, b: Matrix): Promise<Matrix> {
  const r = await postJson<{ result: Matrix }>('/api/multiplicar', { a, b })
  return r.result
}

export async function postTrasponer(m: Matrix): Promise<Matrix> {
  const r = await postJson<{ result: Matrix }>('/api/trasponer', { m })
  return r.result
}

export async function postDeterminante(m: Matrix): Promise<number> {
  const r = await postJson<{ det: number }>('/api/determinante', { m })
  return r.det
}

