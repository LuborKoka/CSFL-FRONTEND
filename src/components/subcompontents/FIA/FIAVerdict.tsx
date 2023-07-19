import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { URI } from "../../../App";
import '../../../styles/verdict.css'
import { useOutletContext } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";
import { useQuery } from "@tanstack/react-query";

type Props = {
    isAddingVerdict: boolean,
    setIsAddingVerdict: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Verdict({ isAddingVerdict, setIsAddingVerdict }: Props) {
    const raceContext = (useOutletContext() as RaceContext)[0]

    const [isPending, setIsPending] = useState(false)

    const query = useQuery([`report_${raceContext.reportID}_concerned_drivers`], () => fetchConcernedDrivers(raceContext.reportID))

    const content = useRef<HTMLTextAreaElement>(null)
    const penalties = useRef<{time: number, penaltyPoints: number, driverID: string}[]>([])

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

    function submit(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)
        console.log(penalties.current)
        const pents = penalties.current.filter(p => (p.penaltyPoints !== 0 || p.time !== 0) ) //poslem len tie, ktore maju aspon jednu hodnotu rozdielnu od 0
        
        console.log(pents)
        axios.post(`${URI}/report/${raceContext.reportID}/verdict/`, {
            params: {
                penalties: pents,
                content: content.current!.value
            }
        })
        .then((r: AxiosResponse) => {

        })
        .catch(e => {

        })
        .finally(() => setIsPending(false))
    }

    return(
        <div className={`verdict-container ${isAddingVerdict ? 'verdict-container-active' : ''}`}>
            <form onSubmit={submit}>
                <textarea ref={content} placeholder='Rozhodnutie' />
                {
                    query.data?.drivers.map(d => <Penalty driverName={d.name} driverID={d.id} setPenalty={setPenalty} key={d.id}/>)
                }

                <button disabled={isPending} type="submit">Odoslať rozhodnutie</button>
            </form>
            <button onClick={() => setIsAddingVerdict(false)}>Zavrieť</button>
        </div>
    )
}

async function fetchConcernedDrivers(reportID: string | undefined) {
    type data = {drivers: {id: string, name: string}[]}
    const response = await axios.get<data>(`${URI}/report/${reportID}/verdict/`)
    return response.data
}


type PenaltyProps = {
    driverID: string,
    driverName: string,
    setPenalty: (time: number, points: number, driverID: string) => void
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
        <div>
            <input type="text" readOnly value={driverName} />
            <input type="number" value={data.time} onChange={setTime} />
            <input type="number" value={data.points} onChange={setPoints} min={0} />     
        </div>
    )
}