import { FormLabel, FormLabelProps } from "@chakra-ui/react"

interface RadioInputProps extends FormLabelProps {
  id: string
  value: string | string[]
  children: string
  isDisabled?: boolean
}

export function RadioCard({
  id,
  children,
  value,
  isDisabled,
  ...rest
}: RadioInputProps) {
  return (
    <FormLabel
      color="text"
      flexShrink={0}
      textAlign="center"
      htmlFor={id}
      whiteSpace="nowrap"
      minW="fit-content"
      padding={["0.75rem 1rem", "0.75rem 1.5rem"]}
      height="fit-content"
      fontSize="14px"
      margin="0"
      border="sm"
      borderRadius="md"
      borderColor="tertiary"
      cursor="pointer"
      userSelect="none"
      _hover={{
        bg: "secondary",
      }}
      _checked={{
        bg: "blue",
        color: "#fff",
        fontWeight: "600",
      }}
      sx={{
        "&>input": {
          display: "none",
        },
      }}
      {...rest}
    >
      {children}
      <input type="radio" id={id} value={value} />
    </FormLabel>
  )
}
