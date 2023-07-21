import React from "react";
import '../../../styles/race.css';
import { Link, useOutletContext } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";


type Props = {
    raceID: string,
    name: string,
    raceName: string,
    date: string,
}

export default function Race({ raceID, name, raceName, date }: Props) {
    const setContext = (useOutletContext() as RaceContext)[1]
    
    function setRace() {
        setContext(p => {
            return {...p, raceName: raceName}
        })
    }

    return(
        <Link onClick={setRace} className="card" to={`race/${raceID}`}>
            <h2>{raceName}</h2>
            <img src='https://cdn-wp.thesportsrush.com/2023/03/9090e1d3-untitled-design-3.jpg?w=1200&q=60' alt='xd' width='200px' height='100px' />
            <p>{convertTimeStamp(date)}</p>
        </Link>
    )
}


function convertTimeStamp(timestamp: string) {
    const date = new Date(timestamp)

    const months = [
    "január", "február", "marec", "apríl", "máj", "jún",
    "júl", "august", "september", "október", "november", "december"
    ]

    // Construct the date string
    const dateString = `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}
    ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    
    return dateString
}