import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { faClock as Clock, faCircleExclamation, faRightLong, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faRectangleXmark, faClock } from '@fortawesome/free-regular-svg-icons'
import exclamation from '../../../images/exclamation.svg'

type Props = {
    verdict: string,
    penalties: {
        driverID: string,
        driverName: string,
        time: number,
        penaltyPoints: number
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
    function closeWindow() {
        setOpen(false)
    }

    return(
        <div className='pop-up-bg' onClick={closeWindow}>
            <div className='pop-up-content' onClick={(e) => e.stopPropagation()}>
                <div className="sticky-heading">
                    <h2 className="header-with-time section-heading fade-in-out-border">
                        {`Rozhodnutie reportu #${rank}`}
                        <FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />
                    </h2>
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
                    <pre>{verdict}</pre>
                    <label>Rozhodnutie FIA</label>
                </div>
                
                <h2 className='fade-in-out-border section-heading'>
                    Penalizácie
                </h2>               
                
                <ul style={{paddingLeft: '1rem'}}>
                    {
                        penalties.map(p => 
                        <div className='penalty-driver-layout' key={p.driverID}>
                            <b>{p.driverName}</b>
                            <span><FontAwesomeIcon icon={faClock} /> {getSecondsString(p.time)}</span>
                            <span style={{gridColumn: '2', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', columnGap: '5px'}} >
                                <img alt="exclamation point icon" src={exclamation} height='16px'/> {getPointsString(p.penaltyPoints)}
                            </span>
                        </div>)
                    }

                </ul>

                
                    
            </div>
        </div>
    )
}



function getSecondsString(time: number) {
    const sign = time < 0 ? '' : '+'
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