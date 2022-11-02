export function removeAccent(text: string) {
  const unaccentedText = text.normalize("NFD").replace(/[^a-z\s]/gi, "")
  return unaccentedText
}
