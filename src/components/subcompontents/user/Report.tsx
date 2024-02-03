import React, { useState, forwardRef, ForwardedRef, useEffect } from "react";
import { ReportResponseProps, ReportType } from "../../screens/Reports";
import ReportVideo from "./ReportVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faPaperclip, faReply, faRightLong, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons'
import ReportVerdict from "./ReportVerdict";
import useRaceContext from "../../../hooks/useRaceContext";
import SectionHeading from "../../reusableCompontents/SectionHeading";
import { URI } from "../../../App";
import useThemeContext from "../../../hooks/useThemeContext";
import ContentPopUp from "../../reusableCompontents/ContentPopUp";
import { useNavigate, useSearchParams } from "react-router-dom";

type Props = {
    setResponseData: React.Dispatch<React.SetStateAction<{isActive: boolean, rank: number, from: string, targets: {name: string, id: string}[]}>>,
} & ReportType

function Report({ rank, verdict, penalties, reportID, videos, content, createdAt, from, targets, setResponseData, responses }: Props, ref: ForwardedRef<HTMLDivElement>) {
    const setRaceContext = useRaceContext()[1]
    const [isViewingResponses, setIsViewingResponses] = useState(false)
    const [isViewingVerdict, setIsViewingVerdict] = useState(false)

    const setSearchParams = useSearchParams()[1]

    const [isDarkTheme] = useThemeContext()

    function openResponseForm() {
        setResponseData({rank: rank, isActive: true, from: from.name, targets: targets})
        setRaceContext(p => {return {...p, reportID: reportID}})
        setSearchParams(`new_r=${rank}`)
        }

    function openResponses() {
        setIsViewingResponses(true)
        setSearchParams(`r=${rank}`)
    }

    function openVerdict() {
        setIsViewingVerdict(true)
        setSearchParams(`v=${rank}`)
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
                <p className={`text-content ${isDarkTheme ? 'dark' : 'light'}`}>{content}</p>
                <label className={`${isDarkTheme ? 'dark' : 'light'}-bg`}>Inchident</label>
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
                <span className='clickable-button mobile-single-column' onClick={openResponseForm}>
                    <FontAwesomeIcon icon={faReply} /> Odpovedať
                </span>

                <span className='clickable-button' onClick={openResponses}>
                    <span className="single-row mobile-single-column" style={{columnGap: '5px'}}>
                        <div style={{position: 'relative'}}>
                            <FontAwesomeIcon style={{transform: 'translateY(10%)'}} icon={faMessage} />
                            <p className={`response-count ${isDarkTheme ? 'dark-text' : 'light-text'}`} >{responses.length}</p>
                        </div>
                        Odpovede
                    </span>
                </span>

                <span className='clickable-button mobile-single-column' onClick={openVerdict}>
                    <img src={`${URI}/media/images/logo_Fia_${isDarkTheme ? 'dark' : 'light'}_mode.svg`} alt="FIA" className="fia-logo" /> Rozhodnutie FIA
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
    const [isDarkTheme] = useThemeContext()
    const navigate = useNavigate()
    
    function closeWindow() {
        setOpen(false)
        navigate(-1)
    }

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

    if ( responses.length === 0 ) return(
        <ContentPopUp closePopUp={closeWindow}>
            <div className={`sticky-heading ${isDarkTheme ? 'dark' : 'light'}-bg`}>
                <SectionHeading sectionHeading withTime time={<FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />}>
                    {`Odpovede k reportu #${rank}`}
                    
                </SectionHeading>
            </div>


            <br/><br/>

            <SectionHeading sectionHeading style={{textAlign: 'center'}}>
                Zatiaľ tu nič nie je.
            </SectionHeading>
        </ContentPopUp>
    )

    return(
        <ContentPopUp closePopUp={closeWindow}>
            <div className={`sticky-heading ${isDarkTheme ? 'dark' : 'light'}-bg`}>
                <SectionHeading sectionHeading withTime time={<FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />}>
                    {`Odpovede k reportu #${rank}`}
                </SectionHeading>
                
            </div>

            {
                responses.map(r => <Response {...r} key={r.id} />)
            }
        </ContentPopUp>
    )
}



function Response({ driverName, id, videos, content, createdAt }: ReportResponseProps) {
    const [isDarkTheme] = useThemeContext()

    return(
        <div className='fade-in-out-border' style={{padding: '0 1rem', position: 'relative', paddingBottom: '2rem', marginBottom: '2rem'}}>
            <SectionHeading withoutFade withTime time={timestampToDateTime(createdAt)}>{driverName}</SectionHeading>
            <br/>
            <div className='labeled-input'>
                <p className='text-content'>{content}</p>
                <label className={`${isDarkTheme ? 'dark' : 'light'}-bg`}>Inchident</label>
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