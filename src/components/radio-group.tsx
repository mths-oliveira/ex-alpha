import { Grid, SimpleGrid } from "@chakra-ui/react"
import { ReactNode, useEffect } from "react"

interface RadioGroupProps {
  children: ReactNode
  name: string
  onChange: (value: string) => void
}

export function RadioGroup({ children, name, onChange }: RadioGroupProps) {
  const id = `group-${name}`
  useEffect(() => {
    const ref = document.getElementById(id)
    ref.addEventListener("change", () => {
      ref.childNodes.forEach((label: HTMLLabelElement) => {
        const input = label.childNodes[1] as HTMLInputElement
        input.checked
          ? label.setAttribute("data-checked", "")
          : label.removeAttribute("data-checked")
      })
    })
  }, [])
  const count = Array.from(children as any).length
  return (
    <Grid
      gap="1rem"
      gridTemplateColumns={`repeat(${count >= 3 ? 3 : 2}, 1fr)`}
      id={id}
      ref={(el) => {
        if (!el) return
        el.childNodes.forEach((label: HTMLLabelElement) => {
          const input = label.childNodes[1] as HTMLInputElement
          if (input.name) return
          input.setAttribute("name", name)
          input.addEventListener("change", () => {
            onChange(input.value)
          })
        })
      }}
    >
      {children}
    </Grid>
  )
}
