import axios from 'axios';
import { URI, UserContext, UserTypes, insertTokenIntoHeader, randomURIkey } from '../../../App';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminOutletContext, OutletSeason } from '../../controls/AdminNav';
import { useContext, Context} from 'react'


export default function AdminSeasons() {
    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`list-of-seasons`],() => fetchSeasons(user?.token))

    const setSeason = (useOutletContext() as AdminOutletContext)[1]

    return(
        <div id='seasons'>
            {
                query.data?.seasons.map(s => 
                    <SeasonLink key={s.id} {...s} setSeason={setSeason} />    
                )
            }
        </div>
    )
}

type LinkProps = {
    id: string,
    name: string,
    setSeason: React.Dispatch<React.SetStateAction<OutletSeason>>
}

function SeasonLink({ id, name, setSeason }: LinkProps) {
    return(
        <Link className='tiltable-card link' to={`/${randomURIkey}/admin/season/${id}`} style={{margin: '2rem', width: 'min(200px, 100%)'}} onClick={() => setSeason(p => {return {...p, seasonName: name}})}>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            
            <div className='content' style={{padding: '1rem 2rem'}} >{name}</div>
        </Link>
    )
}




async function fetchSeasons(token: string | undefined | null) {
    type Data = {
        seasons: {
            id: string,
            name: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/seasons/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return res.data
}