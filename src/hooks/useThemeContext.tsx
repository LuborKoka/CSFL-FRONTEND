import { useContext } from "react";
import { ThemeTypes, ThemeContext } from "../App";



/**
 * A hook to consume theme context.
 * @returns An array that includes the context and a function to set the context.
 */
export default function useThemeContext(): [ThemeTypes['isDark'], ThemeTypes['setIsDark']] {
    const context = useContext<ThemeTypes | null>(ThemeContext)

    if (!context) 
        throw new Error(`useThemeContext is being used outside of theme context provider`)

    return [context.isDark, context.setIsDark]
}


// https://stackoverflow.com/questions/61117608/how-do-i-set-system-preference-dark-mode-in-a-react-app-but-also-allow-users-to