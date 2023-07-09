import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState, useRef } from "react";
import { URI } from "../../../App";
import CreateRace from "./CreateRace";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import AssignDriversTeams from "./AssignDriversTeams";


type TrackData = {
    id: string,
    name: string
}

export type Race = {
    trackID: string, 
    timestamp: string
}

export default function CreateSchedule() {
    const [tracksOptions, setTracksOptions] = useState<{value: string, label: string}[]>([])
    const [createTrackForms, setCreateTrackForm] = useState<JSX.Element[]>([])
    const [seasonID, setSeasonID] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [isPendingSchedule, setIsPendingSchedule] = useState(false)

    const races = useRef<Race[]>([])
    const seasonName = useRef<HTMLInputElement | null>(null)

    function addTrackForm() {
        setCreateTrackForm(p => [...p, <CreateRace options={tracksOptions} racesList={races.current} index={p.length} key={`race_${p.length + 1}`}/>])
    }
    
    //dorobit
    function submitNewSeason(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)
        axios.post(`${URI}/admins/create-season/`, {
            params: {
                name: seasonName.current!.value
            }
        })
        .then((r: AxiosResponse) => {
            setSeasonID(r.data.seasonID as string)
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
        .finally(() => setIsPending(false))
    }

    function submitSchedule(e: React.FormEvent) {
        e.preventDefault()

        setIsPendingSchedule(true)

        axios.post(`${URI}/admins/schedule/`, {
            params: {
                races: races.current,
                seasonID: seasonID
            }
        })
        .then((r: AxiosResponse) => {
            console.log(r.data)
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
        .finally(() => setIsPendingSchedule(false))
    }

    useEffect(()=> {
        axios.get(`${URI}/admins/all-tracks/`)
        .then((r: AxiosResponse) => {
            setTracksOptions(
                (r.data.tracks as TrackData[]).map(t => {
                    return {value: t.id, label: t.name}
                })
            )
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
    }, [])

    return(
        <div>
            <form onSubmit={submitNewSeason}>
                <input ref={seasonName} type="text" placeholder="Meno sezóny" />
                <button disabled={isPending} type="submit">Vytvoriť sezónu</button>
            </form>
            {createTrackForms}
            <FontAwesomeIcon icon={faCirclePlus} beatFade onClick={addTrackForm} />
            <button disabled={isPendingSchedule} onClick={submitSchedule}>Create Schedule</button>

            <AssignDriversTeams seasonID={seasonID}/>
        </div>
    )
}