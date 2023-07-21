import { NavLink, Outlet, useOutletContext, useParams } from "react-router-dom"



export default function RaceNav() {
    const { raceID, seasonID } = useParams()

    const context = useOutletContext()

    return(
        /*<div className='race-section'>*/
        <>
            <div className='race-container'>
                <div className='section'>
                    <Outlet context={context} />
                </div>
            </div>
            <div className='race-navigation'>
                {/*ten prvy link moze ist asi do pici, to bude v tej breadcrumbs navigacii*/}
                <ul>
                    <NavLink className='clickable-button' to={`${raceID}`}>Prehľad</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/results`}>Výsledky</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/reports`}>Reporty</NavLink>
                    <NavLink className='clickable-button' to={`/seasons/${seasonID}/standings`}>Tabuľka</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/reports/new`}>Pridať report</NavLink>
                </ul>
            </div>
        </>
        /*</div>*/
    )
}