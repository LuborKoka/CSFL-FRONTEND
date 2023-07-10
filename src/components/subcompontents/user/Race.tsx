import React from "react";
import '../../../styles/race.css';

type Props = {
    raceID: string,
    name: string,
    raceName: string,
    date: string,
    setMini: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Race({ raceID, name, raceName, date, setMini }: Props) {

    return(
        <div className="race-box" onClick={() => setMini(p => !p)}>
            <h2>{raceName}</h2>
            <p>{date}</p>
        </div>
    )
}