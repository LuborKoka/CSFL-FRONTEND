import axios from 'axios';
import { URI, UserContext, UserTypes, insertTokenIntoHeader, randomURIkey } from '../../../App';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminOutletContext, OutletSeason } from '../../controls/AdminNav';
import { useContext, Context} from 'react'
import CreateSeason from './edit season related/CreateSeason';
import TiltableCard from '../../reusableCompontents/TiltableCard';


export default function AdminSeasons() {
    const { user } = useContext(UserContext as Context<UserTypes>)

    const query = useQuery([`list-of-seasons`],() => fetchSeasons(user?.token))

    const setSeason = (useOutletContext() as AdminOutletContext)[1]

    return(
        <>
            <div id='seasons' style={{paddingBottom: '5rem'}}>
                {
                    query.data?.seasons.map(s => 
                        <SeasonLink key={s.id} {...s} setSeason={setSeason} />    
                    )
                }
            </div>

            <CreateSeason />
        </>
    )
}

type LinkProps = {
    id: string,
    name: string,
    setSeason: React.Dispatch<React.SetStateAction<OutletSeason>>
}

function SeasonLink({ id, name, setSeason }: LinkProps) {
    return(
        <TiltableCard to={`/${randomURIkey}/admin/season/${encodeURIComponent(name)}`} isLink style={{margin: '2rem', width: 'min(200px, 100%)'}} onClick={() => setSeason(p => {return {...p, seasonName: name}})}>
            {name}
        </TiltableCard>


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