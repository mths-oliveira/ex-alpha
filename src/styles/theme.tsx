import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
  semanticTokens: {
    colors: {
      text: {
        default: "#000",
        _dark: "#FFF",
      },
      altText: {
        default: "#606060",
        _dark: "#AAA",
      },
      primary: {
        default: "#FFF",
        _dark: "#202124",
      },
      secondary: {
        default: "#EEE",
        _dark: "rgba(255,255,255,0.1)",
      },
      tertiary: {
        default: "rgba(0,0,0,0.15)",
        _dark: "rgba(255,255,255,0.1)",
      },
    },
  },
  colors: {
    blue: "#0e72ed",
  },
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Montserrat', sans-serif`,
  },
  breakpoints: {
    sm: "40em",
    md: "52em",
    lg: "64em",
    xl: "80em",
  },
  borders: {
    sm: "1px solid transparent",
  },
  styles: {
    global: {
      ".justify-text": {
        whiteSpace: "nowrap",
        textAlignLast: "justify",
        width: "fit-content",
        marginLeft: "auto",
      },
      "html, body": {
        color: "text",
        bg: "primary",
        fontWeight: 500,
        scrollBehavior: "smooth",
      },
      svg: {
        fontSize: "1.25rem",
      },
      "@keyframes slade-in": {
        from: {
          opacity: 0,
          transform: "translateY(50%)",
        },
        to: {
          opacity: 1,
          transform: "initial",
        },
      },
      "@keyframes slade-x-in": {
        from: {
          transform: "translateX(-100%)",
        },
        to: {
          transform: "initial",
        },
      },
      "@keyframes slade-x-out": {
        from: {
          transform: "initial",
        },
        to: {
          transform: "translateX(-100%)",
        },
      },
      "@keyframes scale-in": {
        from: {
          opacity: 0,
          transform: "scale(0.8)",
        },
        to: {
          opacity: 1,
          transform: "scale(1)",
        },
      },
      "@keyframes scale-out": {
        from: {
          opacity: 1,
          transform: "scale(1)",
        },
        to: {
          opacity: 0,
          transform: "scale(0.8)",
        },
      },
    },
  },
})
