import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { URI } from "../../../App";
import '../../../styles/verdict.css'
import { useOutletContext, useParams } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-regular-svg-icons"
import { faCaretDown, faRightLong, faSquareCheck, faTriangleExclamation, faLightbulb } from "@fortawesome/free-solid-svg-icons";

type Props = {
    setIsAddingVerdict: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Verdict({ setIsAddingVerdict }: Props) {
    const { raceID } = useParams()

    const query = useQuery([`race_reports_FIA_${raceID}`], () => fetchReports(raceID))


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
                    <FontAwesomeIcon icon={faLightbulb} style={{color: 'yellow', fontSize: '30px'}}/>
                    <span>Keď už raz odošleš rozhodnutie reportu, nebude sa dať zmeniť</span>
                    <FontAwesomeIcon icon={faLightbulb} style={{color: 'yellow', fontSize: '30px'}}/>
                </div>

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
    const [isPending, setIsPending] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [height, setHeight] = useState('0px')

    const container = useRef<HTMLDivElement>(null)
    const penalties = useRef<{time: number, penaltyPoints: number, driverID: string}[]>([])
    const content = useRef<HTMLTextAreaElement>(null)

    function setPenalty(time: number, points: number, driverID: string) {
        const pen = penalties.current.find(p => p.driverID === driverID)
        if ( pen === undefined ) {
            penalties.current.push({
                driverID: driverID,
                time: time,
                penaltyPoints: points
            })
            return
        }

        pen.time = time
        pen.penaltyPoints = points
    }

    function expand() {
        setIsExpanded(p => !p)
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        const pents = penalties.current.filter(p => (p.penaltyPoints !== 0 || p.time !== 0) ) //poslem len tie, ktore maju aspon jednu hodnotu rozdielnu od 0
        
        axios.post(`${URI}/report/${reportID}/verdict/`, {
            params: {
                penalties: pents,
                content: content.current!.value
            }
        })
        .then((r: AxiosResponse) => {
            setIsExpanded(false)
            setIsSubmitted(true)
        })
        .catch(e => {

        })
        .finally(() => {

        })
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

            <div className='expand-verdict-container' style={{maxHeight: isExpanded ? height : '0px'}}>
                <div ref={container} className='verdict-container'>
                    <div className='inchident labeled-input'>
                        <textarea ref={content} name='verdict' />
                        <label htmlFor='verdict'>Rozhodnutie FIA</label>
                    </div>

                    <div className={`verdict-drivers-container`}>
                        <Penalty driverName={from.name} driverID={from.id} setPenalty={setPenalty} />

                        {
                            targets.map(t => 
                                <Penalty driverID={t.driverID} driverName={t.driverName} key={t.driverID} setPenalty={setPenalty} />    
                            )
                        }

                    </div>

                    <div className='submit-button-container'>
                        <button className={`clickable-button ${isSubmitted ? 'button-disabled' : ''}`} onClick={submit} disabled={isSubmitted} >
                            Odoslať
                        </button>
                    </div>
                </div>                
            </div>
        </div>
    )
}


type PenaltyProps = {
    driverID: string,
    driverName: string,
    setPenalty: (time: number, points: number, driverID: string) => void,
}

function Penalty({ driverID, driverName, setPenalty }: PenaltyProps) {
    const [data, setData] = useState({points: 0, time: 0})

    function setTime(e: React.ChangeEvent<HTMLInputElement>) {

        console.log(driverID)
        setData(p => {return {...p, time: Number(e.target.value)}})
        setPenalty(Number(e.target.value), data.points, driverID)
    }

    function setPoints(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.value)
        setData(p => {return {...p, points: Number(e.target.value)}})
        setPenalty(data.time, Number(e.target.value), driverID)
    }



    return(
        <div className='verdict-driver-item' >
            <span><b>{driverName}</b></span>

            <div className='labeled-input'>
                <input name="time-penalty" value={data.time} className='form-input' type="number" onChange={setTime} />
                <label htmlFor="time-penalty">Časová penalizácia</label>
            </div>
            <div className='labeled-input'>
                <input name="penalty-points" value={data.points} className='form-input' type="number" min={0} onChange={setPoints} />
                <label htmlFor="penalty-points">Trestné body</label>
            </div>    
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