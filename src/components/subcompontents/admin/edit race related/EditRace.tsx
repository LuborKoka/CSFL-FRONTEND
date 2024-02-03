import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useRef, useState, Context } from "react";
import { useParams } from "react-router-dom";
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from "../../../../App";
import DriversSelect from "./DriversSelect";
import SetRaceResults from "./SetRaceResults";
import useConfirmation from "../../../../hooks/useConfirmation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import useErrorMessage from "../../../../hooks/useErrorMessage";
import { RED } from "../../../../constants";
import SectionHeading from "../../../reusableCompontents/SectionHeading";
import UserTip from "../../../reusableCompontents/UserTip";


export default function EditRace() {
    const [isPending, setIsPending] = useState(false)
    const [isDisabledEditing, setIsDisabledEditing] = useState(true)

    const raceDrivers = useRef<{teamID: string, drivers: string[]}[]>([])

    const { raceID } = useParams()

    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`edit-race-${raceID}`], () => fetchPreRace(raceID, user?.token))

    const queryClient = useQueryClient()

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()


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

        function confirm() {
            setIsDisabledEditing(true)
            queryClient.invalidateQueries([`edit-race-${raceID}`])
        }

        setIsPending(true)
        
        axios.post(`${URI}/admins/edit-race/${raceID}/drivers/`, {
            params: {
                teams: raceDrivers.current
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => {
            showConfirmation(confirm)
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }


    const buttons = 
    <div className='submit-button-container'>
        <button className='clickable-button' type='reset' onClick={() => setIsDisabledEditing(true)}>Zrušiť</button>
        <button className={`clickable-button ${isPending && 'button-disabled'}`} disabled={isPending} type="submit">Uložiť</button>
    </div>

    return(
        <>
            <SectionHeading sectionHeading withoutFade>{query.data?.raceName}</SectionHeading>

            <SectionHeading sectionHeading>Jazdci pretekov</SectionHeading>

            <UserTip style={{marginBottom: '2rem'}} >Dávaj si pozor, aby si nezaklikol jedného jazdca do viacerých tímov naraz.</UserTip>
            {
                query.data?.is_empty &&
                <>
                    <h2 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                        Súpiska na túto veľkú cenu ešte nie je uložená.
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
                    </h2>
                    <br/>
                </>
            }
            <form onSubmit={submitRaceDrivers} style={{position: 'relative'}}>
                <div className='top-right' style={{fontSize: '20px'}}>
                    <FontAwesomeIcon icon={faPenToSquare} className='change-icon' onClick={() => setIsDisabledEditing(p => !p)} />
                </div>
                {
                    query.data?.teams.map(t => {
                        return <DriversSelect {...t} setDrivers={setRaceDrivers} key={t.teamID} isDisabled={isDisabledEditing} />
                    })
                }

                {
                    isDisabledEditing ? <br/> : buttons
                }
                
            </form>

            <SectionHeading sectionHeading>Výsledky pretekov</SectionHeading>
            <SetRaceResults raceID={raceID} />
            

            {[
                confirmation, message
            ]}
        </>
    )
}




type Team = {
    teamID: string,
    teamName: string,
    drivers: {
        id: string,
        name: string,
        isReserve: boolean
    }[],
    color: string,
    allOptions: {
        id: string,
        name: string,
        isReserve: boolean
    }[]
}

type Data = {
    raceName: string,
    date: string,
    teams: Team[],
    is_empty: boolean
}


async function fetchPreRace(id: string | undefined, token: string | null | undefined) {
    const response = await axios.get<Data>(`${URI}/admins/edit-race/${id}/drivers/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return response.data
}



