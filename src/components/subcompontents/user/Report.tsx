import React, { useState, forwardRef, ForwardedRef } from "react";
import { ReportResponseProps, ReportType } from "../../screens/Reports";
import ReportVideo from "./ReportVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faPaperclip, faReply, faRightLong, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons'
import FIA from '../../../images/logo_Fia.svg' 
import ReportVerdict from "./ReportVerdict";
import useRaceContext from "../../../hooks/useRaceContext";
import SectionHeading from "../../reusableCompontents/SectionHeading";

type Props = {
    setResponseData: React.Dispatch<React.SetStateAction<{isActive: boolean, rank: number, from: string, targets: {name: string, id: string}[]}>>,
} & ReportType

function Report({ rank, verdict, penalties, reportID, videos, content, createdAt, from, targets, setResponseData, responses }: Props, ref: ForwardedRef<HTMLDivElement>) {
    const setRaceContext = useRaceContext()[1]
    const [isViewingResponses, setIsViewingResponses] = useState(false)
    const [isViewingVerdict, setIsViewingVerdict] = useState(false)

    function openResponseForm() {
        setResponseData({rank: rank, isActive: true, from: from.name, targets: targets})
        setRaceContext(p => {return {...p, reportID: reportID}})
    }

    function openVerdict() {
        setIsViewingVerdict(true)
    }

    return( 
    <>
        <div className='report-card fade-in-out-border' ref={ref}>
            <SectionHeading withTime withoutFade time={timestampToDateTime(createdAt)}>Report #{rank}</SectionHeading>
            

            {
            /*<div className='top-right' style={{top: '0'}}>
                <FontAwesomeIcon icon={faTrashAlt} className='close-icon' style={{fontSize: '20px'}} />
            </div>*/
            }

            <br/><br/>

            <div >
                {from.name}
                <FontAwesomeIcon style={{transform: 'translateY(10%)', margin: '0 15px'}} icon={faRightLong} />
                {
                    targets.map( (t, i) => //zvazit este nejaky marker pre nahlasenych
                        <span key={`reported_player${i}`} className='reported-player'><FontAwesomeIcon icon={faTriangleExclamation} /> {t.name}</span>
                    )
                }
            </div>
            <div className='labeled-input' style={{marginTop: '3rem'}}>
                <p className='text-content'>{content}</p>
                <label>Inchident</label>
            </div>

            <br/><br/>
            <h3 style={{marginBottom: '2rem'}}>
                <FontAwesomeIcon icon={faPaperclip} /> Prílohy
            </h3>

            {
                videos.online.filter(v => !v.embed).map((v, i) => <ReportVideo isOnline {...v} key={`${reportID}_${i}`} />)
            }

            <div className='auto-grid' style={{marginTop: '2rem'}}>
                {
                    videos.online.filter(v => v.embed).map((v, i) => <ReportVideo isOnline {...v} key={`${reportID}_${i}`} />)
                }

                {
                    videos.local.map((v, i) => <ReportVideo isOnline={false} key={`${reportID}_local${i}`} {...v} />)
                }
            </div>

            <br/>

            <div className="single-row" style={{justifyContent: 'space-evenly', whiteSpace:  'nowrap'}}>
                <span className='clickable-button' onClick={openResponseForm}>
                    <FontAwesomeIcon icon={faReply} /> Odpovedať
                </span>

                <span className='clickable-button' onClick={() => setIsViewingResponses(true)}>
                    <span className="single-row" style={{columnGap: '5px'}}>
                        <div style={{position: 'relative'}}>
                            <FontAwesomeIcon style={{transform: 'translateY(10%)'}} icon={faMessage} />
                            <p className="response-count" >{responses.length}</p>
                        </div>
                         Zobraziť odpovede
                    </span>
                </span>

                <span className='clickable-button' onClick={openVerdict}>
                    <img src={FIA} alt="FIA" className="fia-logo" /> Rozhodnutie FIA
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


export default forwardRef(Report)


type ResListProps = {
    responses: ReportResponseProps[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    rank: number
}

function ResponseList({ responses, setOpen, rank }: ResListProps) {
    function closeWindow() {
        setOpen(false)
    }

    if ( responses.length === 0 ) return(
        <div className='pop-up-bg'>
            <div className='pop-up-content'>
                <div className='sticky-heading'>
                    <h2 className='section-heading header-with-time fade-in-out-border'>
                        {`Odpovede k reportu #${rank}`}
                        <FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />
                    </h2>
                </div>


                <br/><br/>

                <h2 className='section-heading' style={{textAlign: 'center'}}>
                    Zatiaľ tu nič nie je.
                </h2>
            </div>
        </div>
    )

    return(
        <div className='pop-up-bg' onPointerDown={closeWindow}>
            <div className='pop-up-content' onPointerDown={(e) => e.stopPropagation()}>
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



function Response({ driverName, id, videos, content, createdAt }: ReportResponseProps) {

    return(
        <div className='fade-in-out-border' style={{padding: '0 1rem', position: 'relative', paddingBottom: '2rem', marginBottom: '2rem'}}>
            <SectionHeading withoutFade withTime time={timestampToDateTime(createdAt)}>{driverName}</SectionHeading>
            <br/>
            <div className='labeled-input'>
                <p className='text-content'>{content}</p>
                <label>Inchident</label>
            </div>

            <br/><br/>
            
            {
                videos.online.filter(v => !v.embed).map((v, i) => <ReportVideo isOnline {...v} key={`${id}_${i}`} />)
            }


            <div className="auto-grid" style={{marginTop: '2rem'}}>
                {
                    videos.online.filter(v => v.embed).map((v, i) => <ReportVideo isOnline {...v} key={`${id}_${i}`} />)
                }

                {
                    videos.local.map((v, i) => <ReportVideo isOnline={false} key={`${id}_local${i}`} {...v} />)
                }
            </div>
        </div>
    )
}




export function timestampToDateTime(timestamp: string) {
    const date = new Date(timestamp)

    return `${date.toLocaleString()}`
}