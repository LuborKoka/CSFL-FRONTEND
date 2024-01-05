import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { forwardRef, ForwardedRef,  InputHTMLAttributes, useState } from "react"
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form"

type Props = {
  label: string
  htmlFor: string
  withToggleVisible?: boolean
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
} & InputHTMLAttributes<HTMLInputElement>

/**
 * 
 * @param label The label that the user will see
 * @param htmlFor The htmlFor attribute of the label element, it needs to be the same as the field name in register() from reactHookForm
 * @param withToggleVisible For password-like inputs, will always set the input type to text or password
 * @param error Error message from reactHookForm
 * @returns A labeled input as a JSX.Element
 */
function LabeledInput({ label, htmlFor, withToggleVisible = false, error, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className='labeled-input'>
            {
                withToggleVisible ? 
                <input className='form-input' {...props} ref={ref} type={isVisible ? 'text' : 'password'} /> :
                <input className='form-input' {...props} ref={ref}  />
            }
          <label htmlFor={htmlFor}>{label}</label>
          {
            withToggleVisible ?
            <FontAwesomeIcon className='center-right' icon={isVisible ? faEye : faEyeSlash} onClick={() => setIsVisible(p => !p)} style={{position: 'absolute'}} /> :
            null
          }
          {/*needs fixing */error && <p className='input-error'>{error as string}</p>}
        </div>
      )
}

export default forwardRef(LabeledInput)