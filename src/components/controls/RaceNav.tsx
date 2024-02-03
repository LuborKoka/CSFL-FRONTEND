import { NavLink, Outlet, useParams } from "react-router-dom"
import FIAVerdict from '../subcompontents/FIA/FIAVerdict'
import { useState } from 'react'
import BottomTabs from "./BottomTabs"
import useUserContext from "../../hooks/useUserContext"
import useSeasonDataContext from "../../hooks/useSeasonDataContext"
import { fetchDrivers } from "../subcompontents/user/RaceOverview"
import { useQuery } from "@tanstack/react-query"
import { fetchSeasonDrivers } from "../screens/Season"
import ClickableButton from "../reusableCompontents/ClickableButton"
import useThemeContext from "../../hooks/useThemeContext"



export default function RaceNav() {
    const { raceID, seasonID } = useParams()

    const [isAddingVerdict, setIsAddingVerdict] = useState(false)

    const context = useSeasonDataContext()
    const user = useUserContext()[0]
    const [isDarkTheme] = useThemeContext()

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
            <aside className={`section-navigation ${isDarkTheme ? 'dark' : 'light'}`}>
                {/*ten prvy link moze ist asi do pici, to bude v tej breadcrumbs navigacii*/}
                <ul>
                    <NavLink to={`${raceID}/overview`}>
                       <ClickableButton>
                            Prehľad
                       </ClickableButton>
                    </NavLink>
                    <NavLink to={`${raceID}/results`}>
                        <ClickableButton>
                            Výsledky
                        </ClickableButton>
                    </NavLink>
                    <NavLink to={`${raceID}/standings`}>
                        <ClickableButton>
                            Tabuľka
                        </ClickableButton>
                    </NavLink>
                    {
                        user?.isLoggedIn && !drivers.data?.isEmptyLineUp && (
                            drivers.data?.teams.some(t => t.drivers.some(d => d.id === user.driverID)) ||
                            drivers.data?.reserves.some(r => r.id === user.driverID) ||
                            user.roles.some(r => r === `${context[0].seasonName}fia`)
                        ) &&
                        <NavLink to={`${raceID}/reports`}>
                            <ClickableButton>
                                Reporty
                            </ClickableButton>
                        </NavLink>
                    }
                    {
                        query.data?.teams.some(t => t.drivers.some(d => d.driverID === user?.driverID)) &&
                        <NavLink to={`${raceID}/new-report`}>
                            <ClickableButton>
                                Pridať report
                            </ClickableButton>
                        </NavLink>
                    }
                    
                    {
                        user?.roles.includes(`${context[0].seasonName}fia`) &&
                        <ClickableButton onClick={openFiaForm}>Kancelária FIA</ClickableButton>
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