import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { URI, randomURIkey } from '../../../App';
import { NavLink } from 'react-router-dom';


export default function AdminSeasons() {
    const [routes, setRoutes] = useState<JSX.Element[]>([])

    useEffect(() => {
        axios.get(`${URI}/seasons/`)
        .then((r: AxiosResponse) => {
            console.log(r.data)
            setRoutes(
                (r.data.seasons as {id: string, name: string}[]).map(s => {
                    return <SeasonLink key={s.id} {...s} />
                })
            )
        })
    }, [])

    return(
        <div id='seasons'>
            {routes}
        </div>
    )
}

type LinkProps = {
    id: string,
    name: string
}

function SeasonLink({ id, name}: LinkProps) {
    return(
        <div style={{display: 'inline-block', padding: '20px'}}>
            <NavLink to={`/${randomURIkey}/admin/season/${id}`}>{name}</NavLink>
        </div>
    )
}