import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState, useRef } from "react";
import { URI } from "../../../App";
import CreateRace from "./CreateRace";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";


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

    const races = useRef<Race[]>([])

    function addTrackForm() {
        setCreateTrackForm(p => [...p, <CreateRace options={tracksOptions} racesList={races.current} index={p.length} key={`race_${p.length + 1}`}/>])
    }
    
    //dorobit
    function submitSchedule() {
        axios.post(`${URI}/`)
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
            {createTrackForms}
            <FontAwesomeIcon icon={faCirclePlus} beatFade onClick={addTrackForm} />
            <button onClick={submitSchedule}>Create Schedule</button>
        </div>
    )
}