export const Settings = (): JSX.Element => (
  <svg
    aria-label="Settings"
    color="#eaf6ff"
    fill="#eaf6ff"
    height="16"
    role="img"
    viewBox="0 0 24 24"
    width="16"
  >
    <circle
      cx="12"
      cy="12"
      fill="none"
      r="8.635"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    ></circle>
    <path
      d="M14.232 3.656a1.269 1.269 0 01-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 01-.796.66m-.001 16.688a1.269 1.269 0 01.796.66l.505.996h1.862l.505-.996a1.269 1.269 0 01.796-.66M3.656 9.768a1.269 1.269 0 01-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 01.66.796m16.688-.001a1.269 1.269 0 01.66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 01-.66-.796M7.678 4.522a1.269 1.269 0 01-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 01-.096 1.03m11.8 11.799a1.269 1.269 0 011.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 01.096-1.03m-14.956.001a1.269 1.269 0 01.096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 011.03.096m11.799-11.8a1.269 1.269 0 01-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 01-1.03-.096"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>
)

export const Pofile = (): JSX.Element => (
  <svg
    aria-label="Profile"
    color="#eaf6ff"
    fill="#eaf6ff"
    height="16"
    role="img"
    viewBox="0 0 24 24"
    width="16"
  >
    <circle
      cx="12.004"
      cy="12.004"
      fill="none"
      r="10.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    ></circle>
    <path
      d="M18.793 20.014a6.08 6.08 0 00-1.778-2.447 3.991 3.991 0 00-2.386-.791H9.38a3.994 3.994 0 00-2.386.791 6.09 6.09 0 00-1.779 2.447"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    ></path>
    <circle
      cx="12.006"
      cy="9.718"
      fill="none"
      r="4.109"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    ></circle>
  </svg>
)

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
