import { createStitches } from '@stitches/react'
import { blackA, blueDark, red, slateDark } from '@radix-ui/colors'

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    theme: {
      colors: {
        ...red,
        ...blueDark,
        ...blackA,
        ...slateDark,

        accentBase: '$slate1',
        accentBgSubtle: '$slate2',
        accentBg: '$slate3',
        accentBgHover: '$slate4',
        accentBgActive: '$slate5',
        accentLine: '$slate6',
        accentBorder: '$slate7',
        accentFocus: '$slate7',
        accentBorderHover: '$slate8',
        accentSolid: '$slate9',
        accentPlaceholderText: '$slate9',
        accentSolidHover: '$slate10',
        accentText: '$slate11',
        accentTextContrast: '$slate12',

        primaryBase: '$blue1',
        primaryBgSubtle: '$blue2',
        primaryBg: '$blue3',
        primaryBgHover: '$blue4',
        primaryBgActive: '$blue5',
        primaryLine: '$blue6',
        primaryBorder: '$blue7',
        primaryFocus: '$blue7',
        primaryBorderHover: '$blue8',
        primarySolid: '$blue9',
        primarySolidHover: '$blue10',
        primaryText: '$blue11',
        primaryTextContrast: '$blue12',

        dangerBase: '$red1',
        dangerBgSubtle: '$red2',
        dangerBg: '$red3',
        dangerBgHover: '$red4',
        dangerBgActive: '$red5',
        dangerLine: '$red6',
        dangerBorder: '$red7',
        dangerBorderHover: '$red8',
        dangerSolid: '$red9',
        dangerPlaceholderText: '$red9',
        dangerSolidHover: '$red10',
        dangerText: '$red11',
        dangerTextContrast: '$red12',
      },

      fontSizes: {
        1: '12px',
        2: '14px',
        3: '16px',
        4: '22px',
        5: '28px',
      },
    },
    media: {
      xm: '(max-width: 30rem)',
      sm: '(min-width: 30.063rem)',
      md: '(min-width: 48.063rem)',
      lg: '(min-width: 64.063rem)',
      xlg: '(min-width: 75.063rem)',
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

export const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

export const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})
