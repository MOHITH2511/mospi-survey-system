type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: unknown }
  | ClassValue[]

function normalize(input: ClassValue, out: string[]) {
  if (!input) return
  if (typeof input === "string" || typeof input === "number") {
    out.push(String(input))
    return
  }
  if (Array.isArray(input)) {
    input.forEach((v) => normalize(v, out))
    return
  }
  if (typeof input === "object") {
    for (const k in input) if ((input as Record<string, unknown>)[k]) out.push(k)
    return
  }
}

export function cn(...inputs: ClassValue[]) {
  const out: string[] = []
  inputs.forEach((i) => normalize(i, out))
  return out.join(" ")
}

export default cn
