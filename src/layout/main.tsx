import { Stack } from "@chakra-ui/react"
import { ReactNode } from "react"

interface MainProps {
  children: ReactNode
}

export function Main({ children }: MainProps) {
  return (
    <Stack as="main" gridArea="main" paddingY={["3.5rem", "4rem"]}>
      {children}
    </Stack>
  )
}
