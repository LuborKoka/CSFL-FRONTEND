import axios from 'axios'
import React, { useContext, Context} from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from '../../../App'
import { useQuery } from '@tanstack/react-query'
import { AdminOutletContext, OutletSeason } from '../../controls/AdminNav'
import { timestampToDateTime } from '../user/Report'
import TiltableCard from '../../reusableCompontents/TiltableCard'

type RaceProps = {
    id: string,
    date: string,
    raceName: string,
    isSprint: boolean,
    trackID: string,
    setSeason: React.Dispatch<React.SetStateAction<OutletSeason>>
}



export default function EditSeason() {
    const { seasonID } = useParams()

    const setSeason = (useOutletContext() as AdminOutletContext)[1]

    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`admin-season-schedule_${seasonID}`], () => fetchSeasonSchedule(seasonID, user?.token))
    

    return(
        <>
            {
                query.data?.races.map(r => {
                    return <RaceBox {...r} key={r.id} setSeason={setSeason} />
                })
            }
            
        </>
    )
}

function RaceBox({ id, raceName, date, isSprint, setSeason}: RaceProps) {
    function setBreadcrumbs() {
        const name = `${isSprint ? 'Sprint: ' : ''}${raceName}`
        setSeason(p => {return {...p, raceName: name}})
    }

    return(
        <TiltableCard isLink to={`race/${id}`} style={{width: 'calc(min(350px, 100%) - 3rem)', margin: '2rem 1.5rem'}} onClick={setBreadcrumbs}>
            <h5>{`${isSprint ? 'Sprint: ' : ''}${raceName}`}</h5>
            <h5>{timestampToDateTime(date)}</h5>
            <i>Upraviť</i>
        </TiltableCard>
    )
}



async function fetchSeasonSchedule(seasonID: string | undefined, token: string | undefined | null) {
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

