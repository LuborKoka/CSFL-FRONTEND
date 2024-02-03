import { Link, LinkProps } from "react-router-dom";
import { ReactNode } from "react";
import useThemeContext from "../../hooks/useThemeContext";


type Props = {
    children: ReactNode,
    isLink?: boolean
} & LinkProps


export default function TiltableCard({ children, isLink = false, ...props }: Props) {
    const [isDarkTheme] = useThemeContext()

    const className = `tiltable-card ${isLink ? 'link' : 'card'} ${isDarkTheme ? 'dark' : 'light'}-card `

    return (
        <Link className={className} {...props}>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>

            <div className='content'>
                {children}
            </div>
        </Link>
    )
}


