import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { forwardRef, ForwardedRef,  InputHTMLAttributes, useState } from "react"
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form"
import useThemeContext from "../../hooks/useThemeContext"

type Props = {
  label: string
  htmlFor: string
  withToggleVisible?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined,
} & InputHTMLAttributes<HTMLInputElement>


function LabeledInput({ label, htmlFor, withToggleVisible = false, error, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) {
    const [isVisible, setIsVisible] = useState(false)
    const [isDarkTheme] = useThemeContext()

    return (
        <div className='labeled-input'>
            <div style={{position: 'relative'}}>
                {
                    withToggleVisible ? 
                    <input className={`form-input ${isDarkTheme ? 'light' : 'dark'}-text`} {...props} ref={ref} type={isVisible ? 'text' : 'password'} /> :
                    <input className={`form-input ${isDarkTheme ? 'light' : 'dark'}-text`} {...props} ref={ref}  />
                    
                }
            <label htmlFor={htmlFor}>{label}</label>

            {
                withToggleVisible ?
                <button type="button" onClick={() => setIsVisible(p => !p)} className='center-right' style={{position: 'absolute', background: 'none', border: 'none'}} >
                    <FontAwesomeIcon  icon={isVisible ? faEye : faEyeSlash}   />
                </button>
                : null
            }
            </div>
            
          
          {/*needs fixing */error && <p className='input-error'>{error as string}</p>}
        </div>
      )
}

/**
 * 
 * @param label The label that the user will see
 * @param htmlFor The htmlFor attribute of the label element, it needs to be the same as the field name in register() from reactHookForm
 * @param withToggleVisible For password-like inputs, will always set the input type to text or password
 * @param error Error message from reactHookForm
 * @returns A labeled input as a JSX.Element
 */
export default forwardRef(LabeledInput)