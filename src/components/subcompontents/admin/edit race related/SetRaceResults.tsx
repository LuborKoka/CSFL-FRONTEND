import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { URI, insertTokenIntoHeader } from '../../../../App'
import { useQuery } from '@tanstack/react-query'
import Select, { SingleValue } from 'react-select'
import { selectSingleValueStyles } from '../edit season related/CreateRace'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import useConfirmation from '../../../../hooks/useConfirmation'
import SingleDriverResult from './SingleDriverResults'
import useErrorMessage from '../../../../hooks/useErrorMessage'
import UserTip from '../../../reusableCompontents/UserTip'
import ClickableButton from '../../../reusableCompontents/ClickableButton'
import useThemeContext from '../../../../hooks/useThemeContext'
import useUserContext from '../../../../hooks/useUserContext'

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
    const [isDisabledEditing, setIsDisabledEditing] = useState(true)
    const [fastestLapDriver, setFastestLapDriver] = useState<{label: string, value: string} | null>(null)

    const [user] = useUserContext()
    const [isDarkTheme] = useThemeContext()

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
            showConfirmation(() => setIsDisabledEditing(true))
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    useEffect(() => {
        if ( !query.data ) return

        if ( query.data.fastestLap ) 
            setFastestLapDriver({label: query.data.fastestLap.driverName, value: query.data.fastestLap.driverID})
    }, [query.data])

    const buttons =
    <div className='submit-button-container'>
        <ClickableButton type='reset' onClick={() => setIsDisabledEditing(true)}>Zrušiť</ClickableButton>
        <ClickableButton disabled={isPending}>Odoslať výsledky</ClickableButton>
    </div>


    return(
        <div>

            <UserTip style={{marginBottom: '1.5rem'}}>
                Čas víťaza zadávaj vo formáte MM:SS:msmsms. Časy ostatných prepíš ako rozostup od víťaza, vždy vo formáte +rozostup, vpodstate opíš výslednú tabuľku z hry.
            </UserTip>

            <UserTip>Ak jazdec nedokončil preteky, napíš tam dnf (nie je to case-sensitive).</UserTip>

            <form onSubmit={submit} style={{position: 'relative'}}>
                <div className='top-right' style={{top: '1rem', fontSize: '20px'}}>
                    <FontAwesomeIcon icon={faPenToSquare} className='change-icon' onClick={() => setIsDisabledEditing(p => !p)} />
                </div>

                <div className='auto-grid' style={{padding: '2rem 1rem', gap: '1rem 2rem'}}>
                    {
                        query.data?.drivers.map(d => 
                            <SingleDriverResult {...d} driverID={d.id} driverName={d.name} isDisabled={isDisabledEditing} key={d.id} saveResult={saveDriverResult} /> 
                        )
                    }
                </div>
                
                
                <div className='labeled-input' style={{padding: '0 1rem', marginTop: '1rem'}}>
                    <Select required placeholder='Hľadať' styles={selectSingleValueStyles(isDarkTheme)} onChange={handleFastestLapChange} value={fastestLapDriver} isDisabled={isDisabledEditing}
                    options={query.data === undefined ? [] : query.data.drivers.map(d => {return {label: d.name, value: d.id}})} name='fl-owner' />
                    <label style={{transform: 'translate(-.2rem, -1.5rem) scale(.8)'}} htmlFor='fl-owner'>Majiteľ najrýchlejšieho kola</label>
                </div>

                {
                    isDisabledEditing ? null : buttons
                }
                
                
            </form>

            {[
                confirmation, message
            ]}
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