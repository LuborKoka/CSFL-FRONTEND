import { ReactNode } from "react";
import useThemeContext from "../../hooks/useThemeContext";


type Props = {
    closePopUp: () => void,
    children: ReactNode
}

export default function ContentPopUp({ closePopUp, children }: Props) {
    const [isDarkTheme] = useThemeContext()

    return (
        <div className="pop-up-bg" onPointerDown={closePopUp}>
            <div className={`pop-up-content ${isDarkTheme ? 'dark' : 'light'}-bg`} onPointerDown={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}