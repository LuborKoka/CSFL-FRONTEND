import { HTMLAttributes, ReactNode } from "react"
import useThemeContext from "../../hooks/useThemeContext"



type Props = {
    text?: string,
    children?: ReactNode,
    withoutFade?: boolean,
    sectionHeading?: boolean,
    withTime?: true,
    time?: string | JSX.Element
} & HTMLAttributes<HTMLHeadingElement>
/**
 * 
 * @param withoutFade true to exclude fade-in-out-border classname
 * @param withTime true to include a timestamp/date in the heading, expects the time prop as a string or a jsx element
 * @param sectionHeading true to include the section-heading classname
 * other props are passed to the h2 element
 * @returns null if no children prop is passed or heading is with time and no time is passed
 */

export default function SectionHeading({ text, children, withoutFade = false, sectionHeading = false, withTime, time, ...props }: Props) {   
    
    if ( !text && !children ) return null

    if ( withTime ) {
        if ( !time ) return null

        const className = `${sectionHeading && 'section-heading'} header-with-time ${withoutFade || 'fade-in-out-border'}`

        return(
            <div className={className}>
                <h2 {...props}>{text || children}</h2>
                {
                    typeof time === 'string' ? <span>{time}</span> : time
                }
                
            </div>
        )
    }
    const className = `${sectionHeading && 'section-heading'} ${withoutFade || 'fade-in-out-border'}`
    return <h2 className={className} {...props}>{text || children}</h2>
}