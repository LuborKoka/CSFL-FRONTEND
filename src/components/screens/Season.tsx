import axios from "axios";
import React, { useState } from "react";
import { URI } from "../../App";
import { useQuery } from '@tanstack/react-query'
import Race from "../subcompontents/user/Race";
import '../../styles/seasons.css'

import { useParams } from "react-router-dom";

type Props = {
    seasonID: string
}

type Data = {
    races: {
        raceID: string,
        date: string,
        name: string,
        raceName: string
    }[]
}

export default function Season() {
    const { seasonID } = useParams()

    const query = useQuery([`season-schedule-${seasonID}`], () => fetchData(seasonID))



    return(
        <div className='section'>
            {
                query?.data?.races.map(r => {
                    return <Race key={r.raceID} raceID={r.raceID} raceName={r.raceName} name={r.name} date={r.date} />
                })
            }
        </div>
    )
}




async function fetchData(seasonID: string | undefined): Promise<Data> {
    const res = await axios.get(`${URI}/season-schedule/${seasonID}/`)
    return res.data
}