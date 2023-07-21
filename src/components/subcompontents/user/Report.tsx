import React from "react";
import { ReportResponseProps, ReportType } from "../../screens/Reports";
import ReportVideo from "./ReportVideo";
import { useOutletContext } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";
import { report } from "process";
import ReportVerdict from "./ReportVerdict";

type Props = {
    setIsAddingResponse: React.Dispatch<React.SetStateAction<boolean>>,
    setIsAddingVerdict: React.Dispatch<React.SetStateAction<boolean>>
} & ReportType

export default function Report({ verdict, penalties, reportID, videos, content, createdAt, from, targets, setIsAddingResponse, responses, setIsAddingVerdict }: Props ) {
    const [raceContext, setRaceContext] = (useOutletContext() as RaceContext)

    function openResponseForm() {
        setIsAddingResponse(true)
        setRaceContext(p => {return {...p, reportID: reportID}})
    }

    function openVerdictForm() {
        setIsAddingVerdict(true)
        setRaceContext(p => {return {...p, reportID: reportID}})
    }

    return(
        <div style={{borderRadius: '20px', backgroundColor: '#001020'}}>
            <h1>Report od {from.name}</h1>
            <h2>Vytvorene: {createdAt}</h2>
            <pre>{content}</pre>
            <h3>Targets: {targets.map(t => t.name)}</h3>

            {
                videos.online.map((v, i) => <ReportVideo isOnline {...v} key={`${reportID}_${i}`} />)
            }

            {
                videos.local.map((v, i) => <ReportVideo isOnline={false} key={`${reportID}_local${i}`} url={v} />)
            }

            <h2>Odpovede</h2>
            {
                responses.map(r => <Response {...r} />)
            }

            <h2>Rozhodnutie FIA</h2>

            <ReportVerdict verdict={verdict} penalties={penalties} />

            <button onClick={openResponseForm}>Pridať odpoveď</button>
            <button onClick={openVerdictForm}>Pridať rozhodnutie</button>
        </div>
    )
}


function Response({ driverID, driverName, id, videos, content, createdAt }: ReportResponseProps) {

    return(
        <div>
            <h1>{driverName}</h1>
            <h4>Created at: {createdAt}</h4>
            <pre>{content}</pre>

            {
                videos.online.map((v, i) => <ReportVideo isOnline {...v} key={`${id}_${i}`} />)
            }

            {
                videos.local.map((v, i) => <ReportVideo isOnline={false} key={`${id}_local${i}`} url={v} />)
            }
        </div>
    )
}