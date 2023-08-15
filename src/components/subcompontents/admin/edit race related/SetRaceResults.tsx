import React, { useState, useRef, useContext, Context, useEffect } from 'react'
import axios from 'axios'
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from '../../../../App'
import { useQuery } from '@tanstack/react-query'
import Select, { SingleValue } from 'react-select'
import { selectSingleValueStyles } from '../edit season related/CreateRace'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import useConfirmation from '../../../../hooks/useConfirmation'
import SingleDriverResult from './SingleDriverResults'
import useErrorMessage from '../../../../hooks/useErrorMessage'

type Results = {
    results: {
        leader: {
            id: string,
            time: string
        } | null,
        otherDrivers: {
            id: string,
            time: string,
            plusLaps: number
        }[]
    }
}

type ResultsProps = {
    raceID: string | undefined
}


export default function SetRaceResults({ raceID }: ResultsProps) {
    const [isPending, setIsPending] = useState(false)
    const [fastestLapDriver, setFastestLapDriver] = useState<{label: string, value: string} | null>(null)

    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`edit-race-results-${raceID}`], () => fetchRaceResults(raceID, user?.token), {staleTime: Infinity})

    const results = useRef<Results>({results: {leader: null, otherDrivers: []}})

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    function handleFastestLapChange(v: SingleValue<{label: string, value: string}>) {
        setFastestLapDriver(v)
    }

    function saveDriverResult(driverID: string, resultTime: string, plusLaps: number) {
        //if race leader/winner
        if ( matchesTimeFormat(resultTime) ) {
            results.current.results.leader = {
                id: driverID,
                time: resultTime
            }
            return
        }

        const driver = results.current.results.otherDrivers.find(d => d.id === driverID)

        if ( !driver ) {
            results.current.results.otherDrivers.push({
                id: driverID, 
                time: resultTime, 
                plusLaps: plusLaps
            })
            return
        }
        driver.time = resultTime
        driver.plusLaps = plusLaps
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)

        const leader = results.current.results.leader!.id
        const index = results.current.results.otherDrivers.findIndex(d => d.id === leader)

        if (index !== -1) results.current.results.otherDrivers.splice(index, 1)

        axios.post(`${URI}/admins/edit-race/${raceID}/results/`, {
            params: {
                results: {
                    leader: results.current.results.leader,
                    otherDrivers: results.current.results.otherDrivers,
                    fastestLap: fastestLapDriver?.value
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => {
            showConfirmation()
        })
        .catch((e: unknown) => {

        })
        .finally(() => setIsPending(false))
    }

    useEffect(() => {
        if ( !query.data ) return

        if ( query.data.fastestLap ) 
            setFastestLapDriver({label: query.data.fastestLap.driverName, value: query.data.fastestLap.driverID})
    }, [query.data])

    return(
        <div>

            <div className='user-tip'>
                <FontAwesomeIcon icon={faLightbulb} />
                <span>Čas víťaza zadávaj vo formáte MM:SS:msmsms. Časy ostatných prepíš ako rozostup od víťaza, vždy vo formáte +rozostup, vpodstate opíš výslednú tabuľku z hry.</span>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>

            <br/>
            <div className='user-tip'>
                <FontAwesomeIcon icon={faLightbulb} />
                <span>Ak nedokončil preteky, napíš tam dnf (nie je to case-sensitive).</span>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>


            <form onSubmit={submit}>
                <div className='auto-grid' style={{padding: '2rem 1rem', gap: '1rem 2rem'}}>
                    {
                        query.data?.drivers.map(d => 
                            <SingleDriverResult {...d} driverID={d.id} driverName={d.name} key={d.id} saveResult={saveDriverResult} /> 
                        )
                    }
                </div>
                
                
                <div className='labeled-input' style={{padding: '0 1rem'}}>
                    <Select required placeholder='Hľadať' styles={selectSingleValueStyles()} onChange={handleFastestLapChange} value={fastestLapDriver}
                    options={query.data === undefined ? [] : query.data.drivers.map(d => {return {label: d.name, value: d.id}})} name='fl-owner' />
                    <label style={{transform: 'translate(-.2rem, -1.5rem) scale(.8)'}} htmlFor='fl-owner'>Majiteľ najrýchlejšieho kola</label>
                </div>

                
                <div className='submit-button-container'>
                    <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} disabled={isPending} type="submit">Odoslať výsledky</button>
                </div>

                
            </form>

            { confirmation }
        </div>
    )
}


async function fetchRaceResults(id: string | undefined, token: string | null | undefined) {
    type Data = {
        drivers: {
            id: string,
            name: string, 
            color: string,
            time: string | null
        }[],
        fastestLap?: {
            driverID: string,
            driverName: string
        }
    }
    const response = await axios.get<Data>(`${URI}/admins/edit-race/${id}/results/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return response.data
}



function matchesTimeFormat(input: string): boolean {
    const regex = /^(?!\+)([0-5]?[0-9]):([0-5]?[0-9])([.,][0-9]{1,3})?/
    return regex.test(input)
}