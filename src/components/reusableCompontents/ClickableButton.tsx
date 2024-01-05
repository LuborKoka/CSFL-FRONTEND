import React, { ButtonHTMLAttributes } from "react"

type Props = {
    withContainer?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>
/**
 * @param withContainer: a boolean to specify if the button should be returned inside a wrapper div
 * 
 * @returns A clickable button with default classname clickable-button and button-disabled classname if disabled
 */
export default function ClickableButton({ withContainer = false, disabled = false, children, ...props}: Props) {
    if ( withContainer ) return(
        <div className='submit-button-container'>
            <button className={`clickable-button ${disabled && 'button-disabled'}`} disabled={disabled} {...props}>
                {children}
            </button>
        </div>
    )

    return(
        <button className={`clickable-button ${disabled && 'button-disabled'}`} disabled={disabled} {...props}>
            {children}
        </button>
    )
}