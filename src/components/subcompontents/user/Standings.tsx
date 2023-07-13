import axios from "axios"
import { useParams } from "react-router-dom"
import { URI } from "../../../App"
import { useQuery } from "@tanstack/react-query"




export default function Standings() {
    const { seasonID } = useParams()

    const query = useQuery([`season_standings_${seasonID}`], () => fetchStandings(seasonID))

    return(
        <div>
            <h1>Tabuľka priebežného poradia jazdov</h1>
            <table>
                <thead>
                    <tr>
                        <th></th><th>Meno</th>
                        {
                            query.data?.races.map((r, i) => <th key={r.id}><img style={imageStyle} alt='' src={`${URI}/images/tracks/${r.trackID}/`} /></th>)
                        }
                        <th>Body</th>
                    </tr>
                </thead>

                <tbody>
                {
                    query.data?.drivers.map((d, i) => {
                        return(
                            <tr key={d.driverID}>
                                <td>{i+1}.</td>
                                <td>{d.driverName}</td>
                                {d.races.map((r, i) => <td key={`race_${i}`}>{r.points}</td>)}
                                <td>{d.totalPoints}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
                
            </table>

            <h1>Tabuľka priebežného poradia konštruktérov</h1>
            <table>
                <thead>
                    <tr>
                        <th></th><th>Tím</th><th>Body</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        query.data?.teams.map((r, i) => {
                            return(
                                <tr key={r.id}>
                                    <td>{i + 1}.</td>
                                    <td>{r.name}</td>
                                    <td>{r.points}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>

            </table>

        </div>
    )
}

const imageStyle = {
    width: '40px'
}

type Race = {
    teamName: string,
    hasFastestLap: boolean,
    rank: number,
    points: number
}


type Driver = {
    driverID: string,
    driverName: string,
    isReserve: boolean,
    totalPoints: number,
    races: Race[]
}

type Data = {
    races: {
        id: string,
        trackID: string
    }[],
    drivers: Driver[],
    teams: {
        id: string,
        name: string,
        points: number,
        color: string
    }[]
}


async function fetchStandings(id: string | undefined) {
    const response = await axios.get<Data>(`${URI}/seasons/${id}/standings/`)
    return response.data
}