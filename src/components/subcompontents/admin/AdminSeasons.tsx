import axios from 'axios';
import { URI, randomURIkey } from '../../../App';
import { NavLink, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminOutletContext, OutletSeason } from '../../controls/AdminNav';


export default function AdminSeasons() {
    const query = useQuery([`list-of-seasons`], fetchSeasons)

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
        <div style={{display: 'inline-block', padding: '20px'}} onClick={() => setSeason(p => {return {...p, seasonName: name}})}>
            <NavLink to={`/${randomURIkey}/admin/season/${id}`}>{name}</NavLink>
        </div>
    )
}




async function fetchSeasons() {
    type Data = {
        seasons: {
            id: string,
            name: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/seasons/`)
    return res.data
}