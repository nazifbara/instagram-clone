export const Create = ({ fill }: IconProps): JSX.Element => {
  return (
    <svg
      aria-label="New Post"
      color="#eaf6ff"
      fill="#eaf6ff"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z"
        fill={fill ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      ></path>
      <line
        fill="none"
        stroke={fill ? '#00254d' : 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="6.545"
        x2="17.455"
        y1="12.001"
        y2="12.001"
      ></line>
      <line
        fill="none"
        stroke={fill ? '#00254d' : 'currentColor'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="12.003"
        x2="12.003"
        y1="6.545"
        y2="17.455"
      ></line>
    </svg>
  )
}

export const Home = ({ fill = false }: IconProps): JSX.Element => {
  return (
    <svg
      aria-label="Home"
      color="#eaf6ff"
      fill="#eaf6ff"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z"
        fill={fill ? 'currentColor' : 'none'}
        stroke={fill ? 'none' : 'currentColor'}
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

type IconProps = {
  fill?: boolean
}
