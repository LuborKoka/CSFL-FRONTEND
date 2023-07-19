import { NavLink, Outlet, useOutletContext, useParams } from "react-router-dom"
import '../../styles/raceNavigation.css'



export default function RaceNav() {
    const { raceID } = useParams()

    const context = useOutletContext()

    return(
        <div className='section'>
            <Outlet context={context} />
            <div className='race-navigation'>
                {/*ten prvy link moze ist asi do pici, to bude v tej breadcrumbs navigacii*/}
                <NavLink to={`${raceID}`}>Prehľad</NavLink>
                <NavLink to={`${raceID}/results`}>Výsledky</NavLink>
                <NavLink to={`${raceID}/reports`}>Reporty</NavLink>
                <NavLink to={`${raceID}/reports/new`}>Pridať report</NavLink>
            </div>
        </div>
    )
}