import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { URI } from "../../../../App";
import DriversSelect from "./DriversSelect";
import SetRaceResults from "./SetRaceResults";
import useConfirmation from "../../../../hooks/useConfirmation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";


export default function EditRace() {
    const [isPending, setIsPending] = useState(false)

    const raceDrivers = useRef<{teamID: string, drivers: string[]}[]>([])
    const reserves = useRef<{id: string, name: string}[]>([])

    const { raceID } = useParams()

    const query = useQuery([`edit-race-${raceID}`], () => fetchPreRace(raceID))

    const queryClient = useQueryClient()

    reserves.current = query.data === undefined ? [] : query.data.reserves

    const [confirmation, showConfirmation] = useConfirmation()


    function setRaceDrivers(teamID: string, drivers: string[]) {
        const team = raceDrivers.current.find(t => teamID === t.teamID)
        if ( team === undefined ) {
            raceDrivers.current.push({
                teamID: teamID,
                drivers: [...drivers]
            })
            return
        }
        team.drivers = [...drivers]
    }

    function submitRaceDrivers(e: React.FormEvent) {
        e.preventDefault()
        setIsPending(true)
        
        axios.post(`${URI}/admins/edit-race/${raceID}/drivers/`, {
            params: {
                teams: raceDrivers.current
            }
        })
        .then((r: AxiosResponse) => {
            showConfirmation(() => queryClient.invalidateQueries([`edit-race-results-${raceID}`]))
        })
        .catch((e: AxiosError) => {

        })
        .finally(() => setIsPending(false))
    }

    return(
        <div>
            <h2>{query.data?.raceName}</h2>
            <h3>{query.data?.date}</h3>

            <h2 className='section-heading fade-in-out-border'>Jazdci pretekov</h2>

            <div className='user-tip'>
                <FontAwesomeIcon icon={faLightbulb} />
                <span>Dávaj si pozor, aby si nezaklikol jedného jazdca do viacerých tímov naraz.</span>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <br/><br/>
            <form onSubmit={submitRaceDrivers}>
                {
                    query.data?.teams.map(t => {
                        return <DriversSelect {...t} reserves={query.data.reserves} setDrivers={setRaceDrivers} key={t.teamID} />
                    })
                }
                <div className='submit-button-container'>
                <button className='clickable-button' disabled={isPending} type="submit">Uložiť</button>
                </div>
            </form>

            <h2 className='section-heading fade-in-out-border'>Výsledky pretekov</h2>
            <SetRaceResults raceID={raceID} />


            { confirmation }
        </div>
    )
}




type Team = {
    teamID: string,
    teamName: string,
    drivers: {
        id: string,
        name: string
    }[],
    color: string
}

type Data = {
    raceName: string,
    date: string,
    teams: Team[],
    reserves: {
        id: string,
        name: string
    }[]
}


async function fetchPreRace(id: string | undefined) {
    const response = await axios.get<Data>(`${URI}/admins/edit-race/${id}/drivers/`)
    return response.data
}



