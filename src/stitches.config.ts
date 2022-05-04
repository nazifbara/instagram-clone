import { createStitches } from '@stitches/react'
import { blackA, blueDark, grayDark, red } from '@radix-ui/colors'

export const { styled, css, globalCss, keyframes, getCssText, theme, createTheme, config } =
  createStitches({
    theme: {
      colors: {
        ...red,
        ...blueDark,
        ...grayDark,
        ...blackA,

        accentBase: '$blue1',
        accentBgSubtle: '$blue2',
        accentBg: '$blue3',
        accentBgHover: '$blue4',
        accentBgActive: '$blue5',
        accentLine: '$blue6',
        accentBorder: '$blue7',
        accentFocus: '$blue7',
        accentBorderHover: '$blue8',
        accentSolid: '$blue9',
        accentSolidHover: '$blue10',
        accentText: '$blue11',
        accentTextContrast: '$blue12',

        grayBase: '$gray1',
        grayBgSubtle: '$gray2',
        grayBg: '$gray3',
        grayBgHover: '$gray4',
        grayBgActive: '$gray5',
        grayLine: '$gray6',
        grayBorder: '$gray7',
        grayBorderHover: '$gray8',
        graySolid: '$gray9',
        grayPlaceholderText: '$gray9',
        graySolidHover: '$gray10',
        grayText: '$gray11',
        grayTextContrast: '$gray12',

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
        dangerTextContrast: '$red12',

        textBase: '$accentTextContrast',
        textGray: '$grayText',
        textPrimary: '$accentSolid',
      },

      fontSizes: {
        1: '12px',
        2: '14px',
        3: '16px',
        4: '22px',
        5: '28px',
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

export const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

export const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})
