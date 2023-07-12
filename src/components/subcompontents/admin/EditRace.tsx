import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { URI } from "../../../App";
import Select, { MultiValue } from 'react-select'


export default function EditRace() {
    const [isPending, setIsPending] = useState(false)

    const raceDrivers = useRef<{teamID: string, drivers: string[]}[]>([])

    const { raceID } = useParams()

    const query = useQuery([`edit-race-${raceID}`], () => fetchTrack(raceID))


    function setRaceDrivers(teamID: string, drivers: string[]) {
        const team = raceDrivers.current.find(t => teamID === t.teamID)
        if ( team === undefined ) {
            raceDrivers.current.push({
                teamID: teamID,
                drivers: [...drivers]
            })
            console.log(raceDrivers.current)
            return
        }
        console.log(raceDrivers.current)
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
            
        })
        .catch((e: AxiosError) => {

        })
        .finally(() => setIsPending(false))
    }

    return(
        <div>
            <h2>{query.data?.raceName}</h2>
            <h3>{query.data?.date}</h3>

            <h1>Set Drivers For The Race</h1>
            <form onSubmit={submitRaceDrivers}>
                {
                    query.data?.teams.map(t => {
                        return <DriversSelect {...t} reserves={query.data.reserves} setDrivers={setRaceDrivers} key={t.teamID} />
                    })
                }
                <button disabled={isPending} type="submit">Vytvoriť</button>
            </form>

            <h1>Set Race Results</h1>
            <SetRaceResults raceID={raceID} />

        </div>
    )
}


//potom na editovanie existujuceho driver lineup pre preteky (aj sezonu) spravit is_set column v db a podla neho vratit komponent pre 
// vytvorenie noveho alebo update existujuceho zlozenia, tak to bude najjedoduchsie a asi aj najprehladnejsie nakodit

//doplnit odoslanie dvojich na backend
type DriversSelectProps = (Team & {reserves: Data["reserves"]} & {setDrivers: (teamID: string, drivers: string[]) => void} ) 

function DriversSelect({ teamID, teamName, drivers, reserves, setDrivers }: DriversSelectProps ) {
    const [value, setValue] = useState<{value: string, label: string}[]>([])
    const [options, setOptions] = useState<{value: string, label: string}[]>([])

    function updateValue(val: MultiValue<{value: string, label: string}>) {
        if ( val.length > 2 ) return
        setValue(val.map(v => v))
        setDrivers(teamID, val.map(v => v.value))
    }

    useEffect(() => {
        setOptions(
            [...drivers.map(d => {return {value: d.id, label: d.name}}), 
            ...reserves.map(r => {return {value: r.id, label: `Rezerva: ${r.name}`}})]
        )

        setValue([...drivers.map(d => {return {value: d.id, label: d.name}})])

        setDrivers(teamID, drivers.map(d => d.id))
    }, [drivers, reserves, teamID, setDrivers])

    return(
        <Select value={value} isMulti placeholder={teamName} options={options} onChange={updateValue}  key={teamID} />
    )
}

type Team = {
    teamID: string,
    teamName: string,
    drivers: {
        id: string,
        name: string
    }[],
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

type ResultsProps = {
    raceID: string | undefined
}

type Results = {
    results: {
        leader: {
            id: string,
            time: string
        } | null,
        otherDrivers: {
            id: string,
            time: string
        }[]
    }

}

function SetRaceResults({ raceID }: ResultsProps) {
    const [isPending, setIsPending] = useState(false)

    const query = useQuery([`edit-race-results-${raceID}`], () => fetchRaceResults(raceID))

    const results = useRef<Results>({results: {leader: null, otherDrivers: []}})

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, id: string) {
        //treba este vyriesit kontrolu, ci to je leader
        if ( matchesTimeFormat(e.target.value) ) {
            results.current.results.leader = {
                id: id,
                time: e.target.value.replace(',', '.')
            }
            return
        }

        const driver = results.current.results.otherDrivers.find(d => d.id === id)
        
        if ( driver === undefined ) {
            results.current.results.otherDrivers.push({
                id: id,
                time: e.target.value.replace(',', '.')
            })
            return
        }

        driver.time = e.target.value
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)

        const leader = results.current.results.leader!.id
        const index = results.current.results.otherDrivers.findIndex(d => d.id === leader)
        const drivers = results.current.results.otherDrivers
        // regex na kontrolovanie, ci je cas v spravnom formate ([0-5]?[0-9]):([0-5]?[0-9])([.,][0-9]{1,3})? 

        axios.post(`${URI}/admins/edit-race/${raceID}/results/`, {
            params: {
                results: {
                    leader: results.current.results.leader,
                    otherDrivers: ( index === -1 ) ? drivers : results.current.results.otherDrivers.splice(index, 1)
                }
            }
        })
        .then((r: AxiosResponse) => {

        })
        .catch((e: AxiosError) => {

        })
        .finally(() => setIsPending(false))
    }

    return(
        <div>
            <form onSubmit={submit}>
                {
                    query.data?.drivers.map(d => {
                        return <input type="text" placeholder={d.name} style={{color: d.color}} required 
                        onChange={(e) => handleChange(e, d.id)} key={d.id} />
                    })
                }
                <button disabled={isPending} type="submit">Odoslať výsledky</button>
            </form>
        </div>
    )
}


async function fetchTrack(id: string | undefined) {
    const response = await axios.get<Data>(`${URI}/admins/edit-race/${id}/drivers/`)
    return response.data
}


async function fetchRaceResults(id: string | undefined): Promise<{drivers: {id: string, name: string, color: string}[]}> {
    const response = await axios.get(`${URI}/admins/edit-race/${id}/results/`)
    return response.data
}


function matchesTimeFormat(input: string): boolean {
    const regex = /^(?!\+)([0-5]?[0-9]):([0-5]?[0-9])([.,][0-9]{1,3})?/
    return regex.test(input)
  }