import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URI } from '../../../App';
import Select, { MultiValue } from 'react-select'
import { sign } from 'crypto';

type Data = {
    teams: {
        id: string,
        name: string,
        signed: string[]
    }[],
    drivers: {
        id: string,
        name: string
    }[]
}

type Params = {
    seasonID: string
}

// potom upravit tu logiku pre ligy s uz priradenymi jazdcami do timov
// 2 select komponenty, jeden na vytvorenie, jeden na update

export default function AssignDriversTeams({ seasonID }: Params) {
    const [elements, setElements] = useState<JSX.Element[]>([])
    const [isPending, setIsPending] = useState(false)

    const teams = useRef<{teamID: string, drivers: string[]}[]>([])

    function setDrivers(v: MultiValue<{value: string, label: string}>, id: string) {
        if ( v.length > 2 ) return
        const team = teams.current.find(t => t.teamID === id)
        team!.drivers = v.map(v => v.value)
        console.log(teams.current)
    }

    function submitDrivers(e: React.FormEvent) {
        e.preventDefault()

        //checknut, ci su vybrani prave dvaja
        setIsPending(true)
        axios.post(`${URI}/admins/all-teams-and-drivers/${seasonID}/`, {
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
        axios.get(`${URI}/admins/all-teams-and-drivers/${seasonID}/`)
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
                    return <TeamSelect {...t} setDrivers={setDrivers} drivers={drivers} key={t.id} />
                })
            )
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })


    }, [seasonID])

    return(
        <div>
            <h1>Vytvorenie jazdeckých dvojíc</h1>
            <form onSubmit={submitDrivers}>
                {elements}
                <button disabled={isPending} type='submit'>Vytvoriť tímové dvojice</button>
            </form>
            

        </div>
    )
}


type TeamSelectProps = {
    id: string,
    name: string,
    signed: string[],
    drivers: {value: string, label: string}[],
    setDrivers: (v: MultiValue<{value: string, label: string}>, id: string) => void
}

function TeamSelect({ id, name, signed, drivers, setDrivers }: TeamSelectProps) {
    const [options, setOptions] = useState<{value: string, label: string}[]>([])

    useEffect(() => {
        if ( signed.length === 0 ) return
        const d = drivers.filter(d => d.value === signed[0] || d.value === signed[1] )
        setOptions(d)
    }, [signed, drivers])

    function setSelected(v: MultiValue<{value: string, label: string}>) {
        setOptions(v.map(d => {
            return {value: d.value, label: d.label}
        }))
        setDrivers(v, id)
    }

    return(
        <Select value={options} isMulti placeholder={name} options={drivers} required onChange={
            (v: MultiValue<{value: string, label: string}>) => setSelected(v)
        } key={id}  />
    )
}