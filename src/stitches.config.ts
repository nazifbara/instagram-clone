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
      mt: (value: string) => ({ marginTop: value }),
      p: (value: string) => ({ padding: value }),
      px: (value: string) => ({ paddingLeft: value, paddingRight: value }),
      wh: (value: string) => ({ width: value, height: value }),
    },
  })
