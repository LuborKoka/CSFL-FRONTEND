import React, { ButtonHTMLAttributes } from "react"
import useThemeContext from "../../hooks/useThemeContext"

type Props = {
    withContainer?: boolean,
    align?: 'left' | 'center' | 'right'
} & ButtonHTMLAttributes<HTMLButtonElement>
/**
 * @param withContainer: a boolean to specify if the button should be returned inside a wrapper div
 * 
 * @returns A clickable button with default classname clickable-button and button-disabled classname if disabled
 */
export default function ClickableButton({ withContainer = false, disabled = false, align = 'left', children, ...props}: Props) {
    const [isDark] = useThemeContext()

    const className = `clickable-button ${disabled && 'button-disabled'} ${isDark ? 'light' : 'dark'}-text`


    if ( withContainer ) return(
        <div className='submit-button-container' style={{textAlign: align}}>
            <button className={className} disabled={disabled} {...props}>
                {children}
            </button>
        </div>
    )

    return(
        <button className={className} disabled={disabled} {...props}  style={{textAlign: align}}>
            {children}
        </button>
    )
}