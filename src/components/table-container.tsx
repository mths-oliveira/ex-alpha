import { Box, BoxProps } from "@chakra-ui/react"

export function TableContainer(props: BoxProps) {
  return (
    <Box
      border="sm"
      borderRadius="md"
      borderColor={["transparent", "tertiary"]}
      padding={["0", "1rem"]}
      {...props}
    />
  )
}
