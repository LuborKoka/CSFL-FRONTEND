import { ReactNode, HTMLAttributes } from "react";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useThemeContext from "../../hooks/useThemeContext";


type Props = {
    children: ReactNode
} & HTMLAttributes<HTMLDivElement>


export default function UserTip({ children, ...props }: Props) {
    const [isDarkTheme] = useThemeContext()

    return(
        <div className={`user-tip ${isDarkTheme ? 'dark' : 'light'}`} {...props}>
            <FontAwesomeIcon icon={faLightbulb} />
                <span>{children}</span>
            <FontAwesomeIcon icon={faLightbulb} />
        </div>
    )
}