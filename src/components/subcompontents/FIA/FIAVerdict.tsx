import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { URI } from "../../../App";
import '../../../styles/verdict.css'
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons"
import { faCaretDown, faRightLong, faSquareCheck, faTriangleExclamation, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import useConfirmation from "../../../hooks/useConfirmation";
import useErrorMessage from "../../../hooks/useErrorMessage";
import ReactSwitch from 'react-switch'
import { DARKBLUE } from "../../../constants";

type Props = {
    setIsAddingVerdict: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Verdict({ setIsAddingVerdict }: Props) {
    const { raceID } = useParams()

    const query = useQuery([`race_reports_FIA_${raceID}`], () => fetchReports(raceID), {staleTime: Infinity})


    function closeWindow() {
        setIsAddingVerdict(false)
    }

    return(
        <div className='pop-up-bg' onClick={closeWindow}>
            <div className='pop-up-content' onClick={(e) => e.stopPropagation()}>
                <div className='sticky-heading'>
                    <h2 className='section-heading header-with-time fade-in-out-border'>
                        {'FIA: '}{query.data?.raceName}
                        <FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />
                    </h2>
                </div>

                <div className='user-tip'>
                    <FontAwesomeIcon icon={faLightbulb} />
                    <span>Keď už raz odošleš rozhodnutie reportu, nebude sa dať zmeniť.<br/>Keď potrebuješ odstrániť penalizáciu (napríklad za traťové limity), naklikaj tam záporné hodnoty.</span>
                    <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <br/>

                {
                    query.data?.reports.map(r => 
                        <ReportSection rank={r.rank} from={r.fromDriver} targets={r.targets} key={r.reportID} reportID={r.reportID} />
                    )
                }

            </div>
        </div>
    )
}


type RSProps = {
    rank: number,
    from: {
        id: string,
        name: string
    }
    targets: {
        driverID: string,
        driverName: string
    }[],
    reportID: string
}


function ReportSection({ rank, from, targets, reportID }: RSProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [height, setHeight] = useState('0px')

    const container = useRef<HTMLDivElement>(null)
    const penalties = useRef<{time: number, penaltyPoints: number, driverID: string, isDSQ: boolean}[]>([])
    const content = useRef<HTMLTextAreaElement>(null)

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    function setPenalty(time: number, points: number, driverID: string, isDSQ: boolean) {
        const pen = penalties.current.find(p => p.driverID === driverID)
        if ( pen === undefined ) {
            penalties.current.push({
                driverID: driverID,
                time: time,
                penaltyPoints: points,
                isDSQ: isDSQ
            })
            return
        }

        pen.time = time
        pen.penaltyPoints = points
        pen.isDSQ = isDSQ
    }

    function expand() {
        setIsExpanded(p => !p)
    }

    function confirm() {
        setIsExpanded(false)
        setIsSubmitted(true)
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        const pents = penalties.current.filter(p => p.penaltyPoints !== 0 || p.time !== 0 || p.isDSQ === true ) //poslem len tie, ktore maju aspon jednu hodnotu rozdielnu od 0
        
        setIsPending(true)
        axios.post(`${URI}/report/${reportID}/verdict/`, {
            params: {
                penalties: pents,
                content: content.current!.value
            }
        })
        .then(() => {
            showConfirmation(confirm)
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }


    useEffect(() => {
        if ( container.current === null || container === null ) return
        const handleResize = () => {
            if ( container.current === null || container === null ) return
            const height = container.current.getBoundingClientRect().height
            setHeight(`${height}px`)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [container, targets])
    
    return(
        <div style={{paddingBottom: '1rem'}}>
            <div className="report-verdict-header fade-in-out-border">
                    <div className={`center clickable-button icon ${isExpanded ? 'rotate-180' : ''}`} onClick={expand}>
                        <FontAwesomeIcon icon={faCaretDown} style={{fontSize: '40px'}} />   
                    </div>

                    <span className='single-row' style={{columnGap: '15px'}}>
                        <b>{`Report #${rank}: `}</b>
                        {from.name}
                        <FontAwesomeIcon style={{transform: 'translateY(10%)'}} icon={faRightLong} />
                        {
                            targets.map( (t, i) => //zvazit este nejaky marker pre nahlasenych
                                <span key={`reported_player${i}`} className='reported-player'><FontAwesomeIcon icon={faTriangleExclamation} /> {t.driverName}</span>
                            )
                        }
                    </span> 

                    {
                        isSubmitted ? <FontAwesomeIcon icon={faSquareCheck} style={{color: 'green', fontSize: '30px'}} /> : null
                    }
            </div>

            <form className='expand-verdict-container' style={{maxHeight: isExpanded ? height : '0px'}} onSubmit={submit}>
                <div ref={container} className='verdict-container'>
                    <div className='inchident labeled-input'>
                        <textarea ref={content} name='verdict' required readOnly={isSubmitted} />
                        <label htmlFor='verdict'>Rozhodnutie FIA</label>
                    </div>

                    <div className={`verdict-drivers-container`}>
                        <Penalty driverName={from.name} driverID={from.id} setPenalty={setPenalty} isSubmitted={isSubmitted} />

                        {
                            targets.map(t => 
                                t.driverID === 'hra' ? null :
                                <Penalty driverID={t.driverID} driverName={t.driverName} key={t.driverID} setPenalty={setPenalty} isSubmitted={isSubmitted} />    
                            )
                        }

                    </div>
                    
                    { /* isSubmitted namiesto is pending, aby sa nedalo znova odoslat report, !nemazat! */}
                    <div className='submit-button-container'>
                        <button type="submit" className={`clickable-button ${( isSubmitted || isPending ) ? 'button-disabled' : ''}`} disabled={isSubmitted} >
                            Odoslať
                        </button>
                    </div>
                </div>                
            </form>

            { confirmation }

            { message }
        </div>
    )
}


type PenaltyProps = {
    driverID: string,
    driverName: string,
    setPenalty: (time: number, points: number, driverID: string, isDSQ: boolean) => void,
    isSubmitted: boolean
}

function Penalty({ driverID, driverName, setPenalty, isSubmitted }: PenaltyProps) {
    const [data, setData] = useState({points: 0, time: 0, isDSQ: false})

    function setTime(e: React.ChangeEvent<HTMLInputElement>) {
        setData(p => {return {...p, time: e.target.valueAsNumber}})
        setPenalty(e.target.valueAsNumber, data.points, driverID, data.isDSQ)
    }

    function setPoints(e: React.ChangeEvent<HTMLInputElement>) {
        setData(p => {return {...p, points: e.target.valueAsNumber}})
        setPenalty(data.time, e.target.valueAsNumber, driverID, data.isDSQ)
    }

    function setIsDsq(checked: boolean) {
        if ( isSubmitted ) return
        setData(p => {return {...p, isDSQ: checked}})
        setPenalty(data.time, data.points, driverID, checked)
    }



    return(
        <div className='verdict-driver-item' >
            <span><b>{driverName}</b></span>

            <div className='labeled-input'>
                <input name="time-penalty" value={data.time} className='form-input' type="number" onChange={setTime} readOnly={isSubmitted} />
                <label htmlFor="time-penalty">Časová penalizácia</label>
            </div>
            <div className='labeled-input'>
                <input name="penalty-points" value={data.points} className='form-input' type="number" min={0} onChange={setPoints} readOnly={isSubmitted} />
                <label htmlFor="penalty-points">Trestné body</label>
            </div>    
            <label className='center clickable-button' style={{columnGap: '2rem', transition: 'opacity .2s', opacity: data.isDSQ ? '1' : '.5', cursor: isSubmitted ? 'default' : 'pointer'}}>
                <b style={{fontSize: '20px'}}>
                    Diskvalifikácia
                </b>
                <ReactSwitch onChange={setIsDsq} checked={data.isDSQ} offColor={DARKBLUE} />
            </label>
        </div>
    )
}


async function fetchReports(raceID: string | undefined) {
    type data = {
        reports: {
            reportID: string,
            rank: number,
            fromDriver: {
                id: string,
                name: string
            },
            targets: {
                driverID: string,
                driverName: string
            }[]
        }[],
        raceName: string
    }
    const response = await axios.get<data>(`${URI}/fia/${raceID}/drivers/`)
    return response.data
}