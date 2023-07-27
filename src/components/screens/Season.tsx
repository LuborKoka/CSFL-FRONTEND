import axios from "axios";
import React, { useState } from "react";
import { URI } from "../../App";
import { useQuery } from '@tanstack/react-query'
import Race from "../subcompontents/user/Race";
import '../../styles/seasons.css'

import { useOutletContext, useParams } from "react-router-dom";
import { RaceContext } from "../controls/SeasonNav";

type Props = {
    seasonID: string
}

export default function Season() {
    const { seasonID } = useParams()

    const setSeason = (useOutletContext() as RaceContext)[1]

    const query = useQuery([`scheduled-races-${seasonID}`], () => fetchData(seasonID, setSeason))



    return(
        <div className='section'>
            {
                query?.data?.races.map(r => {
                    return <Race key={r.id} {...r} />
                })
            }
        </div>
    )
}




async function fetchData(seasonID: string | undefined, setState: React.Dispatch<React.SetStateAction<{raceName: string, seasonName: string, reportID: string}>>) {
    type Data = {
        seasonName: string,
        races: {
            id: string,
            raceName: string,
            date: string,
            trackID: string,
            isSprint: boolean
        }[]
    }
    const res = await axios.get<Data>(`${URI}/schedule/${seasonID}/`)
    setState(p => {return {...p, seasonName: res.data.seasonName}})
    return res.data
}