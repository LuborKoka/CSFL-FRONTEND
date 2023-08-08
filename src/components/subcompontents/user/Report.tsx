import React, { useState } from "react";
import { ReportResponseProps, ReportType } from "../../screens/Reports";
import ReportVideo from "./ReportVideo";
import { useOutletContext } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faPaperclip, faReply, faRightLong, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons'
import { ReactComponent as FIA } from '../../../images/logo_Fia.svg' 
import ReportVerdict from "./ReportVerdict";

type Props = {
    setResponseData: React.Dispatch<React.SetStateAction<{isActive: boolean, rank: number, from: string, targets: {name: string, id: string}[]}>>,
} & ReportType

export default function Report({ rank, verdict, penalties, reportID, videos, content, createdAt, from, targets, setResponseData, responses }: Props ) {
    const [raceContext, setRaceContext] = (useOutletContext() as RaceContext)
    const [isViewingResponses, setIsViewingResponses] = useState(false)
    const [isViewingVerdict, setIsViewingVerdict] = useState(false)

    function openResponseForm() {
        setResponseData({rank: rank, isActive: true, from: from.name, targets: targets})
        setRaceContext(p => {return {...p, reportID: reportID}})
    }

    function openVerdict() {
        //setIsAddingVerdict(true)
        //setRaceContext(p => {return {...p, reportID: reportID}})
        setIsViewingVerdict(true)
    }

    return( 
    <>
        <div className='report-card fade-in-out-border'>
            <div className='header-with-time'>
                <h2>Report #{rank}</h2>
                <span>{timestampToDateTime(createdAt)}</span>
            </div>

            <br/><br/>

            <span className='single-row' style={{columnGap: '15px'}}>
                {from.name}
                <FontAwesomeIcon style={{transform: 'translateY(10%)'}} icon={faRightLong} />
                {
                    targets.map( (t, i) => //zvazit este nejaky marker pre nahlasenych
                        <span key={`reported_player${i}`} className='reported-player'><FontAwesomeIcon icon={faTriangleExclamation} /> {t.name}</span>
                    )
                }
            </span>
            <div className='labeled-input' style={{marginTop: '3rem'}}>
                <p className='text-content'>{content}</p>
                <label>Inchident</label>
            </div>

            <br/><br/>
            <h3 style={{marginBottom: '2rem'}}>
                <FontAwesomeIcon icon={faPaperclip} /> Prílohy
            </h3>

            <div className='auto-grid'>
                {
                    videos.online.map((v, i) => <ReportVideo isOnline {...v} key={`${reportID}_${i}`} />)
                }

                {
                    videos.local.map((v, i) => <ReportVideo isOnline={false} key={`${reportID}_local${i}`} {...v} />)
                }
            </div>

            <br/>

            <div className="single-row" style={{justifyContent: 'space-evenly', fontSize: '25px'}}>
                <span className='clickable-button' onClick={openResponseForm}>
                    <FontAwesomeIcon icon={faReply} /> Odpovedať
                </span>

                <span className='clickable-button' onClick={() => setIsViewingResponses(true)}>
                    <span className="single-row" style={{columnGap: '10px'}}>
                        <div style={{position: 'relative'}}>
                            <FontAwesomeIcon style={{transform: 'translateY(10%)'}} icon={faMessage} />
                            <p className="response-count" >{responses.length}</p>
                        </div>
                         Zobraziť odpovede
                    </span>
                </span>

                <span className='clickable-button' onClick={openVerdict}>
                    <FIA style={{height: '15px'}}/> Rozhodutie FIA
                </span>
            </div>


            {/*<ReportVerdict verdict={verdict} penalties={penalties} />*/}
        </div>

        {
                isViewingResponses ? <ResponseList rank={rank} responses={responses} setOpen={setIsViewingResponses} /> : null
            }

            {
                isViewingVerdict ? <ReportVerdict targets={targets} from={from.name} rank={rank} verdict={verdict} penalties={penalties} setOpen={setIsViewingVerdict} /> : null
            }

    </>
    )
}

type ResListProps = {
    responses: ReportResponseProps[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    rank: number
}

function ResponseList({ responses, setOpen, rank }: ResListProps) {
    function closeWindow() {
        setOpen(false)
    }

    return(
        <div className='pop-up-bg' onClick={closeWindow}>
            <div className='pop-up-content' onClick={(e) => e.stopPropagation()}>
                <div className='sticky-heading'>
                    <h2 className='section-heading header-with-time fade-in-out-border'>
                        {`Odpovede k reportu #${rank}`}
                        <FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />
                    </h2>
                    
                </div>

                {
                    responses.map(r => <Response {...r} key={r.id} />)
                }
            </div>
        </div>
    )
}



function Response({ driverID, driverName, id, videos, content, createdAt }: ReportResponseProps) {

    return(
        <div className='report-response fade-in-out-border' style={{padding: '0 1rem', position: 'relative', paddingBottom: '2rem'}}>
            <div className='header-with-time'>
                <h2>{driverName}</h2>
                <span>{timestampToDateTime(createdAt)}</span>
            </div>
            <br/>
            <div className='labeled-input'>
                <p className='text-content'>{content}</p>
                <label>Inchident</label>
            </div>

            <br/><br/>

            {
                videos.online.map((v, i) => <ReportVideo isOnline {...v} key={`${id}_${i}`} />)
            }

            {
                videos.local.map((v, i) => <ReportVideo isOnline={false} key={`${id}_local${i}`} {...v} />)
            }
        </div>
    )
}




export function timestampToDateTime(timestamp: string) {
    const date = new Date(timestamp)

    return `${date.toLocaleString()}`
}