import axios from 'axios'
import React, { useContext, Context} from 'react'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { URI, UserContext, UserTypes, insertTokenIntoHeader } from '../../../App'
import { useQuery } from '@tanstack/react-query'
import { AdminOutletContext, OutletSeason } from '../../controls/AdminNav'
import { timestampToDateTime } from '../user/Report'

type RaceProps = {
    id: string,
    date: string,
    raceName: string,
    isSprint: boolean,
    trackID: string,
    setSeason: React.Dispatch<React.SetStateAction<OutletSeason>>
}

type Data = {
    races: RaceProps[]
}


export default function EditSeason() {
    const { seasonID } = useParams()

    const setSeason = (useOutletContext() as AdminOutletContext)[1]

    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`admin-season-schedule_${seasonID}`], () => fetchSeasonSchedule(seasonID, user?.token))
    

    return(
        <div>
            {
                query.data?.races.map(r => {
                    return <RaceBox {...r} key={r.id} setSeason={setSeason} />
                })
            }
            
        </div>
    )
}

function RaceBox({ id, raceName, date, isSprint, setSeason}: RaceProps) {
    function setBreadcrumbs() {
        const name = `${isSprint ? 'Sprint: ' : ''}${raceName}`
        setSeason(p => {return {...p, raceName: name}})
    }

    return(
        <Link className='tiltable-card link' style={{margin: '2rem'}} to={`race/${id}`} onClick={setBreadcrumbs}>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            
            <div className='content'>
                <h5>{`${isSprint ? 'Sprint: ' : ''}${raceName}`}</h5>
                <h5>{timestampToDateTime(date)}</h5>
                <i>Upraviť</i>
            </div>
        </Link>
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

