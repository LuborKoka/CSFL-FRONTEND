import { faHandMiddleFinger, faPoo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from '../../images/notFound.gif'

export function NotFound() {
    return(
        <div style={{marginTop: '5vh', textAlign: 'center'}}>
            <h2 className="section-heading fade-in-out-border">
                404 Not Found
            </h2>

            <img src={Image} alt='Not Found' />
        </div>
    )
}

export function Forbidden() {
    return(
        <div style={{marginTop: '5vh', textAlign: 'center'}}> 
                <h2 className="section-heading fade-in-out-border">
                    <FontAwesomeIcon icon={faHandMiddleFinger} style={{paddingRight: '2rem', fontSize: '28px'}} bounce />
                    <FontAwesomeIcon icon={faPoo} style={{paddingRight: '2rem', fontSize: '28px', animationDelay: '.25s'}} bounce />
                    403 Forbidden
                    <FontAwesomeIcon icon={faPoo} style={{paddingLeft: '2rem', fontSize: '28px', animationDelay: '.5s'}} bounce />
                    <FontAwesomeIcon icon={faHandMiddleFinger} style={{paddingLeft: '2rem', fontSize: '28px', animationDelay: '.75s'}} bounce />
                </h2>
                
        </div>
        
    )
}

