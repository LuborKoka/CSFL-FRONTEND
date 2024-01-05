import { ReactNode, HTMLAttributes } from "react";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


type Props = {
    children: ReactNode
} & HTMLAttributes<HTMLDivElement>


export default function UserTip({ children, ...props }: Props) {

    return(
        <div className='user-tip' {...props}>
            <FontAwesomeIcon icon={faLightbulb} />
            <span>{children}</span>
            <FontAwesomeIcon icon={faLightbulb} />
        </div>
    )
}