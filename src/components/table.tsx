import { Table as ChakraTable, TableProps } from "@chakra-ui/react"

export function Table({ children, sx, ...rest }: TableProps) {
  return (
    <ChakraTable
      sx={{
        "*>tr>th": {
          color: "altText",
        },
        "&>caption": {
          color: "text",
        },
        "&>caption, *>tr>*": {
          padding: ["1rem", "1rem 1.5rem"],
        },
        "&>*>tr>*": {
          borderColor: "tertiary",
          whiteSpace: "nowrap",
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </ChakraTable>
  )
}
