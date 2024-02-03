import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { faRightLong, faSkullCrossbones, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faRectangleXmark, faClock } from '@fortawesome/free-regular-svg-icons'
import DarkExclamation from '../../../images/exclamation_dark_mode.svg'
import LightExclamation from '../../../images/exclamation_light_mode.svg'
import useThemeContext from "../../../hooks/useThemeContext";
import SectionHeading from "../../reusableCompontents/SectionHeading";
import ContentPopUp from "../../reusableCompontents/ContentPopUp";
import { useNavigate } from "react-router-dom";

type Props = {
    verdict: string,
    penalties: {
        driverID: string,
        driverName: string,
        time: number,
        penaltyPoints: number,
        isDSQ: boolean
    }[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    rank: number,
    from: string,
    targets: {
        id: string,
        name: string
    }[]
}

export default function ReportVerdict({ verdict, penalties, setOpen, rank, from, targets }: Props) {
    const [isDarkTheme] = useThemeContext()
    const navigate = useNavigate()

    //navigation for mobile users so they dont have to reach for that ugly ass close icon
    useEffect(() => {
        const originalPopstateListener = window.onpopstate

        const handlePopstate = () => {
            setOpen(false)
        }
    
        window.addEventListener('popstate', handlePopstate)
    
        return () => {
          window.removeEventListener('popstate', handlePopstate)
          window.onpopstate = originalPopstateListener
        }
      }, [setOpen])

    function closeWindow() {
        setOpen(false)
        navigate(-1)
    }

    if ( verdict === null ) return(
        <ContentPopUp closePopUp={closeWindow}>
            <div className={`sticky-heading ${isDarkTheme ? 'dark' : 'light'}-bg`}>
                <SectionHeading sectionHeading withTime time={<FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />}>
                    {`Rozhodnutie reportu #${rank}`}
                </SectionHeading>
            </div>


            <div>
                {from}
                <FontAwesomeIcon style={{transform: 'translateY(10%)', margin: '0 15px'}} icon={faRightLong} />
                {
                    targets.map( (t, i) => //zvazit este nejaky marker pre nahlasenych
                        <span key={`reported_player${i}`} className='reported-player'><FontAwesomeIcon icon={faTriangleExclamation} /> {t.name}</span>
                    )
                }
            </div> 
            <br/><br/>

            <SectionHeading sectionHeading style={{textAlign: 'center'}}>
                Rozhodnutie ešte nebolo zverejnené
            </SectionHeading>
        </ContentPopUp>
    )

    return(
        <ContentPopUp closePopUp={closeWindow}>
            <div className={`sticky-heading ${isDarkTheme ? 'dark' : 'light'}-bg`}>
                <SectionHeading sectionHeading withTime time={<FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />}>
                    {`Rozhodnutie reportu #${rank}`}
                </SectionHeading>
            </div>

            <span className='single-row' style={{columnGap: '15px'}}>
                {from}
                <FontAwesomeIcon style={{transform: 'translateY(10%)'}} icon={faRightLong} />
                {
                    targets.map( (t, i) => //zvazit este nejaky marker pre nahlasenych
                        <span key={`reported_player${i}`} className='reported-player'><FontAwesomeIcon icon={faTriangleExclamation} /> {t.name}</span>
                    )
                }
            </span> 
            <br/>

            <div className="inchident labeled-input">
                <p className={`text-content ${isDarkTheme ? 'dark' : 'light'}`}>{verdict}</p>
                <label className={`${isDarkTheme ? 'dark' : 'light'}-bg`}>Rozhodnutie FIA</label>
            </div>
            
            {
                penalties.length > 0 &&

                <>
                    <h2 className='fade-in-out-border section-heading'>
                        Penalizácie
                    </h2>               
                    
                    
                    <ul style={{paddingLeft: '1rem'}}>
                        {
                            penalties.map(p => 
                            <div className='penalty-driver-layout' key={p.driverID}>
                                <b>{p.driverName}</b>
                                    {
                                    p.isDSQ ?
                                    <span><FontAwesomeIcon icon={faSkullCrossbones} /> Diskvalifikácia</span> :
                                    <>
                                        <span><FontAwesomeIcon icon={faClock} /> {getSecondsString(p.time)}</span>
                                        <span style={{gridColumn: '2', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', columnGap: '5px'}} >
                                            <img alt="exclamation point icon" src={isDarkTheme ? DarkExclamation : LightExclamation} height='16px'/> {getPointsString(p.penaltyPoints)}
                                        </span>
                                    </>
                                    }
                                
                            </div>)
                        }

                    </ul>
                </>
            }
        </ContentPopUp>
    )
}



function getSecondsString(time: number) {
    const sign = time < 0 ? '-' : '+'
    const amount = Math.abs(time)

    if ( amount === 1 ) return `${sign}${amount} sekunda`
    if ( amount <= 4 && amount >= 2 ) return `${sign}${amount} sekundy`
    return `${sign}${amount} sekúnd` 
}


function getPointsString(amount: number) {
    if ( amount === 1 ) return `+1 trestný bod`
    if ( amount <= 4 && amount >= 2 ) return `+${amount} trestné body`
    return `+${amount} trestných bodov`
}