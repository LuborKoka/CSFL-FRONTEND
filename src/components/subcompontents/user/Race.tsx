import React from "react";
import '../../../styles/race.css';
import { useOutletContext } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";
import TiltableCard from "../../reusableCompontents/TiltableCard";
import { URI } from "../../../App";


type Props = {
    id: string,
    raceName: string,
    date: string,
    trackID: string,
    isSprint: boolean,
    image: string
}

export default function Race({ id, isSprint, raceName, date, image }: Props) {
    const setContext = (useOutletContext() as RaceContext)[1]
    
    function setRace() {
        setContext(p => {
            return {...p, raceName: `${isSprint ? 'Sprint: ' : ''}${raceName}`}
        })
    }

    return(
        <TiltableCard to={`race/${id}/overview`} onClick={setRace}>
            <b>{`${isSprint ? 'Sprint: ' : ''}${raceName}`}</b>
                <img src={`${URI}/media/${image}/`} style={{objectFit: 'cover'}} alt={raceName} width='200px' height='100px' />
            <p>{convertTimeStamp(date)}</p>
        </TiltableCard>
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