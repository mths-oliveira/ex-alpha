import { Image, ImageProps } from "@chakra-ui/react"
import { removeAccent } from "../utils/remove-accent"

interface FlagImageProps extends ImageProps {
  country: string
}

export function FlagImage({ country, ...rest }: FlagImageProps) {
  const formatedCountry = removeAccent(country)
    .toLowerCase()
    .replace(/\W/g, "-")
  return (
    <Image
      alt={country}
      src={`/${formatedCountry}.png`}
      filter="drop-shadow(0 0 8px rgba(0,0,0,0.15))"
      {...rest}
    />
  )
}
