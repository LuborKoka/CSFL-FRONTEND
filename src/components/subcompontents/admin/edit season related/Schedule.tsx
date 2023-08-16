import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useContext, useState, useRef, Context } from "react";
import { URI, UserContext, UserTypes, generateRandomString, insertTokenIntoHeader } from "../../../../App";
import CreateRace from "./CreateRace";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ExistingRace from "./ExistingRace";
import useConfirmation from "../../../../hooks/useConfirmation";
import useUserContext from "../../../../hooks/useUserContext";

type RaceResponse = {
    raceID: string,
    raceName: string,
    date: string
}


export type Race = {
    trackID: string, 
    timestamp: string,
    id: string,
    hasSprint: boolean
}

export default function Schedule() {
    const [createTrackForms, setCreateTrackForms] = useState<{elementID: string, element: JSX.Element}[]>([])
    const [isPendingSchedule, setIsPendingSchedule] = useState(false)

    const { seasonID } = useParams()

    const races = useRef<Race[]>([])

    const user = useUserContext()[0]

    const tracks = useQuery([`admin_all-tracks`], () => fetchTracks(user?.token), {staleTime: Infinity})
    const existingRaces = useQuery([`scheduled-races-${seasonID}`], () => fetchExistingRaces(seasonID, user?.token), { staleTime: Infinity})

    const queryClient = useQueryClient()

    const [confirmation, showConfirmation] = useConfirmation()




    function addTrackForm() {
        setCreateTrackForms(p => {
            const elementID = generateRandomString(12)
            return [...p, {elementID: elementID, 
                element: <CreateRace elementID={elementID}
                options={tracks.data === undefined ? [] : tracks.data.tracks.map(t => {return {value: t.id, label: t.name}})} 
                racesList={races.current} key={elementID} deleteForm={deleteForm}
                />}]
        })
    }

    function deleteForm(elementID: string) {
        setCreateTrackForms(p => p.filter(e => e.elementID !== elementID))
        races.current = races.current.filter(r => r.id !== elementID)
    }

    async function deleteRace(raceID: string) {
        axios.delete(`${URI}/schedule/${seasonID}/${raceID}/`, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`,
                'X-CSRFToken': user?.csrfToken
            }
        })
        .then(r => {
            queryClient.invalidateQueries([`scheduled-races-${seasonID}`])
            showConfirmation()
        })
        .catch(e => {
        })
    }

    async function patchRace(raceID: string, trackID: string, date: string) {
        try {
            await axios.patch(`${URI}/schedule/${seasonID}/${raceID}/`, {
                params: {
                    trackID: trackID,
                    date: date
                }
            }, {
                headers: {
                    Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`,
                    'X-CSRFToken': user?.csrfToken
                }
            })
            queryClient.invalidateQueries([`scheduled-races-${seasonID}`])
            //tuto sa confirmation deje vnutri elementu
            showConfirmation()
            return true
        } catch (e: unknown) {
            return false
        }
    }

    function submitSchedule(e: React.FormEvent) {
        e.preventDefault()

        setIsPendingSchedule(true)

        console.log(races.current)

        axios.post(`${URI}/schedule/${seasonID}/`, {
            params: {
                races: races.current
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`,
                'X-CSRFToken': user?.csrfToken
            }
        })
        .then((r: AxiosResponse) => {
            queryClient.invalidateQueries([`scheduled-races-${seasonID}`])
            showConfirmation(() => setCreateTrackForms([]))
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
        .finally(() => setIsPendingSchedule(false))
    }


    return(
        <div>
            <div className='user-tip'>
                <FontAwesomeIcon icon={faLightbulb} />
                <span>Preteky, ktoré majú dátum v minulosti (oproti terajšku), sa už nedajú upraviť ani vymazať. Dávaj si pozor na to, aký dátum im nastavíš.<br/>
                    Nezabudni si zaškrtnúť šprinty. Defaultne ich veľká cena nemá.
                </span>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <br/><br/><br/>

            {createTrackForms.map(f => f.element)}
            <br/>
            <button className='clickable-button' onClick={addTrackForm}>Pridať ďalšiu veľkú cenu</button>
            
            {
                createTrackForms.length === 0 ? null :
                <div className='submit-button-container'>
                    <button className={`clickable-button ${isPendingSchedule ? 'button-disabled' : ''}`} disabled={isPendingSchedule} onClick={submitSchedule}>Create Schedule</button>
                </div>
            }

            <br/><br/>
            <h2 className='section-heading fade-in-out-border'>
                Už existujúci kalendár
            </h2>
            
            {
                existingRaces.data?.races.map(r => 
                    <ExistingRace {...r}  patchRace={patchRace} deleteRace={deleteRace}  options={tracks.data === undefined ? [] : tracks.data.tracks.map(t => {return {value: t.id, label: t.name}})} key={r.id} />    
                )
            }

            { confirmation }
        </div>
    )
}


export async function fetchTracks(token: string | null | undefined) {
    type Data = {
        tracks: {
            id: string,
            name: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/admins/all-tracks/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return res.data
}


async function fetchExistingRaces(seasonID: string | undefined, token: string | undefined | null) {
    type Data = {
        races: {
            id: string,
            raceName: string,
            date: string,
            trackID: string,
            isSprint: boolean
        }[]
    }
    const res = await axios.get<Data>(`${URI}/schedule/${seasonID}/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return res.data
}

