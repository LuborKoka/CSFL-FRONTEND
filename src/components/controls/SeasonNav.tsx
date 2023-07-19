import { Outlet } from "react-router-dom";
import React, { useState } from 'react'

type Data = {
    raceName: string,
    seasonName: string,
    reportID: string
}

export type RaceContext = [
    Data, React.Dispatch<React.SetStateAction<Data>>
]

export default function SeasonNav() {
    const [context, setContext] = useState<Data>({raceName: '', seasonName: '', reportID: ''})

    return(
        <div>
            <div>
                <h1>Season Navigation</h1>

            </div>

            <Outlet context={[context, setContext]} />
        </div>
    )
}