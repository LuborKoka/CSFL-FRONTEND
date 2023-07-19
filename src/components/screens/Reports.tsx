import React, { useState } from "react"
import axios from "axios"
import { URI } from "../../App"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import Report from "../subcompontents/user/Report"
import ReportResponse from "../subcompontents/user/ReportResponse"
import Verdict from "../subcompontents/FIA/FIAVerdict"


export default function Reports() {
    //An animation technique I don't often see is what I call The Poof. Very simple: transition to a big-ass blur, 
    //opacity to 0 and scale up. Add in a skew and a translation in a direction for extra flair. Looks like the element 
    //disappears in a puff of smoke. I'm sure you can think of situations where this would be appropriate and satisfying. 
    //The reverse is also pretty impressive. https://youtu.be/y8-F5-2EIcg
    const [isAddingResponse, setIsAddingResponse] = useState(false)
    const [isAddingVerdict, setIsAddingVerdict] = useState(false)

    const { raceID } = useParams()

    const query = useQuery([`race_${raceID}_reports`], () => fetchReports(raceID))
    return(
        <div>
            <h1>Reporty</h1>
            {
                query.data?.reports.map(r =>/* toten setter musi ist dovnutra komponentu, tam uz mam aj tak kontext na reportID, ktory treba nastavit */ 
                    <Report key={r.reportID} {...r} setIsAddingResponse={setIsAddingResponse} setIsAddingVerdict={setIsAddingVerdict} />
                )
            }
            reports
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <ReportResponse isAddingResponse={isAddingResponse} setIsAddingResponse={setIsAddingResponse} />
            <Verdict isAddingVerdict={isAddingVerdict} setIsAddingVerdict={setIsAddingVerdict} />
        </div>
    )
}

export type ReportResponseProps = {
    id: string,
    videos: {
        local: string[],
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
        local: string[]
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
        penaltyPoints: number
    }[]
}

type Data = {
    reports: ReportType[]
}

async function fetchReports(id: string | undefined) {
    const res = await axios.get<Data>(`${URI}/races/${id}/reports/`)
    return res.data
}