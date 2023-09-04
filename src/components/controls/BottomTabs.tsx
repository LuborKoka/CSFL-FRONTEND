import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, useParams } from "react-router-dom"
import { faAddressCard, faPlusCircle, faTable, faTableList } from "@fortawesome/free-solid-svg-icons"
import FiaLogo from '../../images/logo_Fia.svg'
import useUserContext from "../../hooks/useUserContext"
import useSeasonDataContext from "../../hooks/useSeasonDataContext"
import { useQuery } from "@tanstack/react-query"
import { fetchDrivers } from "../subcompontents/user/RaceOverview"
import { fetchSeasonDrivers } from "../screens/Season"

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


export default function BottomTabs({ setOpen}: Props) {
    const { raceID, seasonID } = useParams()

    const user = useUserContext()[0]
    const season = useSeasonDataContext()[0]

    const query = useQuery([`race_${raceID}_drivers_overview`], () => fetchDrivers(raceID))
    const drivers = useQuery([`season-drivers-user-${seasonID}`], () => fetchSeasonDrivers(seasonID))

    function openFiaForm() {
        setOpen(true)
    }

    return(
        <nav className='bottom-tabs'>
            <NavLink className='bottom-tabs-link' to={`${raceID}/results`}>
                <div>
                    <FontAwesomeIcon icon={faTable} />
                </div>
                Výsledky
            </NavLink>
            <NavLink className='bottom-tabs-link' to={`${raceID}/standings`}>
                <div>
                    <FontAwesomeIcon icon={faTableList} />
                </div>
                Tabuľka
            </NavLink>
            {
                user?.isLoggedIn && !drivers.data?.isEmptyLineUp && (
                    drivers.data?.teams.some(t => t.drivers.some(d => d.id === user.driverID)) ||
                    drivers.data?.reserves.some(r => r.id === user.driverID)
                ) &&
                <NavLink className='bottom-tabs-link' to={`${raceID}/reports`}>
                    <div>
                        <FontAwesomeIcon icon={faAddressCard} />
                    </div>
                    Reporty
                </NavLink>
            }
            {
                query.data?.teams.some(t => t.drivers.some(d => d.driverID === user?.driverID)) &&
                <NavLink className='bottom-tabs-link' to={`${raceID}/new-report`}>
                    <div>
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </div>
                    Nový report
                </NavLink>
            }
            {
                user?.roles.includes(`${season.seasonName}fia`) &&
                <button onClick={openFiaForm} className='bottom-tabs-link' style={{background: 'none', border: 'none'}}>
                    <img src={FiaLogo} height='15px' alt="fia" />
                    FIA
                </button>
            }

        </nav>
    )
}