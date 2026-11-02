// Vérification rapide des contrastes WCAG 2.2 (AA) de la palette.
// Usage : node scripts/check-contrast.mjs
const rel = (c) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const lum = (hex) => {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  return 0.2126 * rel(r) + 0.7152 * rel(g) + 0.0722 * rel(b)
}
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

const light = {
  bg: '#FDFAF3',
  surface: '#F6F0E4',
  text: '#1F2A21',
  muted: '#54604F',
  link: '#8C4520',
  line: '#E2D8C4',
  accent: '#B4552F',
  buttonBg: '#8C4520',
  buttonText: '#FFFDF7',
}
const dark = {
  bg: '#141813',
  surface: '#1D231C',
  text: '#EFEDE3',
  muted: '#B3BCA9',
  link: '#E5A277',
  line: '#333B31',
  accent: '#DC8B62',
  buttonBg: '#DC8B62',
  buttonText: '#1B1F19',
}

const pairs = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['link', 'bg'],
  ['link', 'surface'],
  ['accent', 'bg'],
  ['buttonText', 'buttonBg'],
  ['buttonBg', 'bg'],
  ['line', 'bg'],
]

let failures = 0
for (const [name, theme] of [
  ['CLAIR', light],
  ['SOMBRE', dark],
]) {
  console.log(`\n== ${name}`)
  for (const [fg, bg] of pairs) {
    const r = ratio(theme[fg], theme[bg])
    const need4 = ['text', 'muted', 'link', 'buttonText', 'accent'].includes(fg) ? 4.5 : 3
    const ok = r >= need4
    if (!ok) failures += 1
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${fg.padEnd(11)} sur ${bg.padEnd(8)} ${theme[fg]} / ${theme[bg]} = ${r.toFixed(2)} (min ${need4})`,
    )
  }
}
console.log(`\n${failures} échec(s)`)
