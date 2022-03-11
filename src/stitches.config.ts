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
      px: (value: string) => ({ paddingLeft: value, paddingRight: value }),
    },
  })
