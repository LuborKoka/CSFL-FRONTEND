import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { URI } from '../../../App';
import { NavLink } from 'react-router-dom';


export default function AdminSeasons() {
    const [routes, setRoutes] = useState<JSX.Element[]>([])

    useEffect(() => {
        axios.get(`${URI}/seasons/`)
        .then((r: AxiosResponse) => {
            setRoutes(
                (r.data.seasons as {id: string, name: string}[]).map(s => {
                    return <SeasonLink key={s.id} {...s} />
                })
            )
        })
    }, [])

    return(
        <div>
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
            <NavLink to={`/admin/season/${id}`}>{name}</NavLink>
        </div>
    )
}