import { Link } from "react-router-dom";
import useThemeContext from "../../hooks/useThemeContext";
import SectionHeading from "./SectionHeading";
import { URI } from "../../App";

type Props = {
    link: string,
    heading: string,
    title: string,
    text: string,
    imgSrc: string,
    imgAlt: string
}

export default function InvitationCard({ link, heading, title, text, imgSrc, imgAlt }: Props) {
    const [isDarkTheme] = useThemeContext()


    return (
        <Link target='_blank' style={{textDecoration: 'none'}} to={link}>
            <div className={`invitation-card ${isDarkTheme ? 'light' : 'dark'}-text`}>
                <SectionHeading>{heading}</SectionHeading>

                <p style={{fontWeight: 'bold'}}>{title}</p>

                <p>{text}</p>

                {
                    heading.toLowerCase() === 'instagram' && <br/>
                }
            
                <img src={`${URI}${imgSrc}`} alt={imgAlt} width='150px' />

            </div>
        </Link>
    )
}