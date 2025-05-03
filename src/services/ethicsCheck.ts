const PALAVRAS_PROIBIDAS = [
  "cura", "garantia", "comprovado", "100%", "milagre", "sem riscos", "promessa", "resultado garantido"
];

export function checkEthics(texto: string): string[] {
  const textoLower = texto.toLowerCase();
  return PALAVRAS_PROIBIDAS.filter(palavra => textoLower.includes(palavra));
}