/**
 * Convert a hex color (#rrggbb) to an approximate oklch CSS string.
 * Uses a simplified sRGB → linear RGB → OKLab → OKLch pipeline.
 */
export function hexToOklch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  // sRGB to linear
  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  // Linear RGB to LMS (using OKLab matrix)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  // Cube root
  const l3 = Math.cbrt(l_)
  const m3 = Math.cbrt(m_)
  const s3 = Math.cbrt(s_)

  // LMS to OKLab
  const L = 0.2104542553 * l3 + 0.7936177850 * m3 - 0.0040720468 * s3
  const a = 1.9779984951 * l3 - 2.4285922050 * m3 + 0.4505937099 * s3
  const bLab = 0.0259040371 * l3 + 0.7827717662 * m3 - 0.8086757660 * s3

  // OKLab to OKLch
  const C = Math.sqrt(a * a + bLab * bLab)
  let H = (Math.atan2(bLab, a) * 180) / Math.PI
  if (H < 0) H += 360

  return `oklch(${L.toFixed(2)} ${C.toFixed(2)} ${H.toFixed(0)})`
}

/**
 * Convert an oklch CSS string to an approximate hex color.
 */
export function oklchToHex(oklch: string): string {
  const match = oklch.match(/oklch\(([0-9.%]+)\s+([0-9.]+)\s+([0-9.]+)\)/)
  if (!match) return '#888888'

  let L = parseFloat(match[1])
  if (match[1].includes('%')) L /= 100
  const C = parseFloat(match[2])
  const H = parseFloat(match[3])

  // OKLch to OKLab
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  // OKLab to LMS cube roots
  const l3 = L + 0.3963377774 * a + 0.2158037573 * b
  const m3 = L - 0.1055613458 * a - 0.0638541728 * b
  const s3 = L - 0.0894841775 * a - 1.2914855480 * b

  // Cube
  const l_ = l3 * l3 * l3
  const m_ = m3 * m3 * m3
  const s_ = s3 * s3 * s3

  // LMS to linear RGB
  const lr = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_

  // Linear to sRGB
  const toSrgb = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c))
    return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
  }

  const toHex = (c: number) => {
    const val = Math.round(Math.max(0, Math.min(255, toSrgb(c) * 255)))
    return val.toString(16).padStart(2, '0')
  }

  return `#${toHex(lr)}${toHex(lg)}${toHex(lb)}`
}
