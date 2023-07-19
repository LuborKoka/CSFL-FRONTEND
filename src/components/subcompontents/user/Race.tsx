import React from "react";
import '../../../styles/race.css';
import { Link, useOutletContext } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";


type Props = {
    raceID: string,
    name: string,
    raceName: string,
    date: string,
    setMini: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Race({ raceID, name, raceName, date, setMini }: Props) {
    const setContext = (useOutletContext() as RaceContext)[1]
    
    function setRace() {
        setContext(p => {
            return {...p, raceName: raceName}
        })
    }

    return(
        <div className="race-box" onClick={() => setMini(p => !p)}>
            <h2>{raceName}</h2>
            <p>{date}</p>
            <div onClick={setRace}><Link to={`race/${raceID}`}>View</Link></div>
        </div>
    )
}