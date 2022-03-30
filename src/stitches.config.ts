import { createStitches } from '@stitches/react'
import { blueDark, grayDark } from '@radix-ui/colors'

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    theme: {
      colors: {
        ...blueDark,
        ...grayDark,
      },
      fontSizes: {
        1: '12px',
        2: '14px',
      },
    },
    utils: {
      m: (value: string) => ({ margin: value }),
      mx: (value: string) => ({ marginLeft: value, marginRight: value }),
      my: (value: string) => ({ marginTop: value, marginBottom: value }),
      mt: (value: string) => ({ marginTop: value }),
      ml: (value: string) => ({ marginLeft: value }),
      mr: (value: string) => ({ marginRight: value }),
      mb: (value: string) => ({ marginBottom: value }),
      p: (value: string) => ({ padding: value }),
      py: (value: string) => ({ paddingTop: value, paddingBottom: value }),
      pt: (value: string) => ({ paddingTop: value }),
      pl: (value: string) => ({ paddingLeft: value }),
      pr: (value: string) => ({ paddingRight: value }),
      pb: (value: string) => ({ paddingBottom: value }),
      px: (value: string) => ({ paddingLeft: value, paddingRight: value }),
      wh: (value: string) => ({ width: value, height: value }),
    },
  })
