import React, { RefObject, createRef, useEffect, useRef, useState } from "react"
import axios from "axios"
import { URI } from "../../App"
import { useQuery } from "@tanstack/react-query"
import { useLocation, useParams } from "react-router-dom"
import Report from "../subcompontents/user/Report"
import ReportResponse from "../subcompontents/user/ReportResponse"
import '../../styles/newReport.css'
import '../../styles/report.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"
import Loader from "../reusableCompontents/Loader"
import SectionHeading from "../reusableCompontents/SectionHeading"


export default function Reports() {
    //An animation technique I don't often see is what I call The Poof. Very simple: transition to a big-ass blur, 
    //opacity to 0 and scale up. Add in a skew and a translation in a direction for extra flair. Looks like the element 
    //disappears in a puff of smoke. I'm sure you can think of situations where this would be appropriate and satisfying. 
    //The reverse is also pretty impressive. https://youtu.be/y8-F5-2EIcg
    const [responseData, setResponseData] = useState({isActive: false, rank: 0, from: '', targets: [{name: '', id: ''}]})

    const reportRefs = useRef<RefObject<HTMLDivElement>[]>([])
        
    const { raceID } = useParams()
    const params = new URLSearchParams(useLocation().search)
    const hash = useLocation().hash

    const query = useQuery([`race_${raceID}_reports`], () => fetchReports(raceID))

    if ( query.data && query.data.reports.length !== reportRefs.current.length) {
        reportRefs.current = Array(query.data?.reports.length).fill(null).map((_, i) => reportRefs.current[i] || createRef<HTMLDivElement>())
    }

    
    useEffect(() => {
        const index = Number(params.get('report')) || Number(hash.substring(1))
        if ( !index ) return
        
        if ( isNaN(index) ) return

        const target = (reportRefs.current as any).toReversed().at(index - 1) //apparently, the toReversed method doesnt exist on an array according to ts       

        async function scroll() {
            if ( !target ) return
            await new Promise(r => setTimeout(r, 100))
            target.current?.scrollIntoView({behavior: 'smooth'})
        }

        scroll()
        

        //eslint-disable-next-line
    }, [params, reportRefs.current, hash])


    if ( query.isLoading) return(
        <>
            <SectionHeading sectionHeading>Reporty</SectionHeading>
            <Loader type='reports' />
        </>
    )

    if ( query.data?.reports.length === 0 ) {
        return(
            <>
                <br/><br/>
                <SectionHeading sectionHeading style={{textAlign: 'center'}}>
                    Žiadne reporty
                    <FontAwesomeIcon icon={faThumbsUp} style={{ margin: '0 2rem'}} />
                </SectionHeading>
            </>
        )
    }


    return(
        <>
            <SectionHeading sectionHeading>Reporty</SectionHeading>
            {
                query.data?.reports.slice().reverse().map((r, i) =>/* toten setter musi ist dovnutra komponentu, tam uz mam aj tak kontext na reportID, ktory treba nastavit */                    
                    <Report key={r.reportID} {...r} setResponseData={setResponseData} ref={reportRefs.current[i]} />
                )
            }
            <ReportResponse responseData={responseData} setResponseData={setResponseData} raceID={raceID} />
        </>
    )
}

export type ReportResponseProps = {
    id: string,
    videos: {
        local: {
            isImage: boolean,
            url: string
        }[],
        online: {
            url: string,
            embed: boolean
        }[]
    },
    content: string,
    createdAt: string,
    driverID: string,
    driverName: string
}

export type ReportType = {
    reportID: string,
    from: {
        id: string,
        name: string
    },
    content: string,
    videos: {
        online: {
            url: string,
            embed: boolean
        }[],
        local: {
            isImage: boolean,
            url: string
        }[]
    },
    targets: {
        id: string,
        name: string
    }[],
    createdAt: string,
    responses: ReportResponseProps[],
    verdict: string,
    penalties: {
        driverID: string,
        driverName: string,
        time: number,
        penaltyPoints: number,
        isDSQ: boolean
    }[],
    rank: number
}

type Data = {
    reports: ReportType[]
}

async function fetchReports(id: string | undefined) {
    const res = await axios.get<Data>(`${URI}/races/${id}/reports/`)
    return res.data
}