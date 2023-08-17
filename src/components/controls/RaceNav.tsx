import { NavLink, Outlet, useParams } from "react-router-dom"
import FIAVerdict from '../subcompontents/FIA/FIAVerdict'
import { useState } from 'react'
import BottomTabs from "./BottomTabs"
import useUserContext from "../../hooks/useUserContext"
import useSeasonDataContext from "../../hooks/useSeasonDataContext"
import { fetchDrivers } from "../subcompontents/user/RaceOverview"
import { useQuery } from "@tanstack/react-query"
import { fetchSeasonDrivers } from "../screens/Season"



export default function RaceNav() {
    const { raceID, seasonID } = useParams()

    const [isAddingVerdict, setIsAddingVerdict] = useState(false)

    const context = useSeasonDataContext()
    const user = useUserContext()[0]

    const query = useQuery([`race_${raceID}_drivers_overview`], () => fetchDrivers(raceID))
    const drivers = useQuery([`season-drivers-user-${seasonID}`], () => fetchSeasonDrivers(seasonID))

    function openFiaForm() {
        setIsAddingVerdict(true)
    }

    return(
        <>
            <div className='section-container'>
                <div className='section'>
                    <Outlet context={context} />
                </div>
            </div>
            <aside className='section-navigation'>
                {/*ten prvy link moze ist asi do pici, to bude v tej breadcrumbs navigacii*/}
                <ul>
                    <NavLink className='clickable-button' to={`${raceID}/overview`}>Prehľad</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/results`}>Výsledky</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/standings`}>Tabuľka</NavLink>
                    {
                        user?.isLoggedIn && !drivers.data?.isEmptyLineUp && (
                            drivers.data?.teams.some(t => t.drivers.some(d => d.id === user.driverID)) ||
                            drivers.data?.reserves.some(r => r.id === user.driverID)
                        ) &&
                        <NavLink className='clickable-button' to={`${raceID}/reports`}>Reporty</NavLink>
                    }
                    {
                        query.data?.teams.some(t => t.drivers.some(d => d.driverID === user?.driverID)) &&
                        <NavLink className='clickable-button' to={`${raceID}/new-report`}>Pridať report</NavLink>
                    }
                    
                    {
                        user?.roles.includes(`${context[0].seasonName}fia`) &&
                        <button onClick={openFiaForm} className='clickable-button single-row'>Kancelária FIA</button>
                    }
                </ul>
            </aside>

            {
                isAddingVerdict ? <FIAVerdict setIsAddingVerdict={setIsAddingVerdict} /> : null
            }

            <BottomTabs setOpen={setIsAddingVerdict} />
        </>
    )
}