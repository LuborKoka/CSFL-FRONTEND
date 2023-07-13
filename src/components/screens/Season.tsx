import axios from "axios";
import React, { useState } from "react";
import { URI } from "../../App";
import { useQuery } from '@tanstack/react-query'
import Race from "../subcompontents/user/Race";
import RaceDetails from "./RaceDetails";
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

    const [isMinimized, setIsMinimized] = useState(false)

    const { data } = useQuery([`season-schedule-${seasonID}`], () => fetchData(seasonID))

    return(
        <div className={`season-container `}>
            <div className={`season-navigation `}>   {/*isMinimized ? 'season-minimized' : ''*/}
                {
                    data?.races.map(r => {
                        return <Race setMini={setIsMinimized} key={r.raceID} raceID={r.raceID} raceName={r.raceName} name={r.name} date={r.date} />
                    })
                }
            </div>
        </div>
    )
}




async function fetchData(seasonID: string | undefined): Promise<Data> {
    const res = await axios.get(`${URI}/season-schedule/${seasonID}/`)
    return res.data
}