import React, { useState, useRef } from 'react'
import axios from 'axios'
import { URI } from '../../../../App'
import { useQuery } from '@tanstack/react-query'
import Select, { SingleValue } from 'react-select'
import { selectSingleValueStyles } from '../edit season related/CreateRace'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import useConfirmation from '../../../../hooks/useConfirmation'

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
    },
    fastestLap: string

}

type ResultsProps = {
    raceID: string | undefined
}


export default function SetRaceResults({ raceID }: ResultsProps) {
    const [isPending, setIsPending] = useState(false)

    const query = useQuery([`edit-race-results-${raceID}`], () => fetchRaceResults(raceID))

    const results = useRef<Results>({results: {leader: null, otherDrivers: []}, fastestLap: ''})

    const [confirmation, showConfirmation] = useConfirmation()

    function handleFastestLapChange(v: SingleValue<{label: string, value: string}>) {
        if ( v === null ) return

        results.current.fastestLap = v.value
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, id: string) {
        //treba este vyriesit kontrolu, ci to je leader
        //vyriesene
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
        // regex na kontrolovanie, ci je cas v spravnom formate ([0-5]?[0-9]):([0-5]?[0-9])([.,][0-9]{1,3})? 

        if (index !== -1) results.current.results.otherDrivers.splice(index, 1)

        axios.post(`${URI}/admins/edit-race/${raceID}/results/`, {
            params: {
                results: {
                    leader: results.current.results.leader,
                    otherDrivers: results.current.results.otherDrivers,
                    fastestLap: results.current.fastestLap
                }
            }
        })
        .then((r) => {
            showConfirmation()
        })
        .catch((e) => {

        })
        .finally(() => setIsPending(false))
    }

    return(
        <div>

            <div className='user-tip'>
                <FontAwesomeIcon icon={faLightbulb} />
                <span>Čas víťaza zadávaj vo formáte MM:SS:msmsms. Časy ostatných prepíš ako rozostup od víťaza, vždy vo formáte +rozostup, vpodstate opíš výslednú tabuľku z hry. <br/> Ak nedokončil preteky, napíš tam dnf (nie je to case-sensitive).</span>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>


            <form onSubmit={submit}>
                <div className='auto-grid' style={{padding: '2rem 1rem', gap: '1rem 2rem'}}>
                    {
                        query.data?.drivers.map(d => 
                            <div className='labeled-input' key={d.id}>
                                <input name={d.name} className='form-input' type="text" required
                                style={{color: d.color, boxShadow: `0 0 10px 5px ${d.color}`}}  onChange={(e) => handleChange(e, d.id)} />
                            
                                <label style={{color: d.color}} htmlFor={d.name}>{d.name}</label>

                            </div>
                            
                        )
                    }
                </div>
                
                
                <div style={{padding: '0 1rem'}}>
                    <Select required placeholder='Majiteľ najrýchlejšieho kola' styles={selectSingleValueStyles()} onChange={handleFastestLapChange}
                    options={query.data === undefined ? [] : query.data.drivers.map(d => {return {label: d.name, value: d.id}})}/>
                </div>

                
                <div className='submit-button-container'>
                    <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} disabled={isPending} type="submit">Odoslať výsledky</button>
                </div>

                
            </form>

            { confirmation }
        </div>
    )
}



async function fetchRaceResults(id: string | undefined) {
    type Data = {
        drivers: {
            id: string,
            name: string, 
            color: string
        }[]
    }
    const response = await axios.get<Data>(`${URI}/admins/edit-race/${id}/results/`)
    return response.data
}



function matchesTimeFormat(input: string): boolean {
    const regex = /^(?!\+)([0-5]?[0-9]):([0-5]?[0-9])([.,][0-9]{1,3})?/
    return regex.test(input)
  }