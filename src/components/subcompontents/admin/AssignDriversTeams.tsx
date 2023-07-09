import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URI } from '../../../App';
import Select, { MultiValue } from 'react-select'

type Data = {
    teams: {
        id: string,
        name: string
    }[],
    drivers: {
        id: string,
        name: string
    }[]
}

type Params = {
    seasonID: string
}

export default function AssignDriversTeams({ seasonID }: Params) {
    const [elements, setElements] = useState<JSX.Element[]>([])
    const [isPending, setIsPending] = useState(false)

    const teams = useRef<{teamID: string, drivers: string[]}[]>([])

    function setDrivers(v: MultiValue<{value: string, label: string}>, id: string) {
        if ( v.length !== 2 ) return
        const team = teams.current.find(t => t.teamID === id)
        team!.drivers.push(v[0].value)
        team!.drivers.push(v[1].value)
    }

    function submitDrivers(e: React.FormEvent) {
        e.preventDefault()

        //checknut, ci su vybrani prave dvaja
        setIsPending(true)
        axios.post(`${URI}/admins/all-teams-and-drivers/`, {
            params: {
                teams: teams.current,
                seasonID: seasonID
            }
        })
        .then((r: AxiosResponse) => {
            console.log(r)
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
        .finally(() => setIsPending(false))
    }


    useEffect(() => {
        axios.get(`${URI}/admins/all-teams-and-drivers/`)
        .then((r: AxiosResponse) => {
            const data = r.data as Data

            const drivers = data.drivers.map(d => {
                return {
                    value: d.id,
                    label: d.name
                }
            })


            teams.current = []
            setElements(
                data.teams.map((t, i) => {
                    teams.current.push({
                        teamID: t.id,
                        drivers: []
                    })
                    return <Select isMulti placeholder={t.name} options={drivers} required onChange={
                        (v: MultiValue<{value: string, label: string}>) => setDrivers(v, t.id)
                    } key={t.id}  />
                })
            )
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })


    }, [])

    return(
        <div>
            <form onSubmit={submitDrivers}>
                {elements}
                <button disabled={isPending} type='submit'>Vytvoriť tímové dvojice</button>
            </form>
            

        </div>
    )
}