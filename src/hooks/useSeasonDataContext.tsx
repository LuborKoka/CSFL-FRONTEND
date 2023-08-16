import { useOutletContext } from "react-router-dom";
import { RaceContext } from "../components/controls/SeasonNav";

/**
 * A hook to consume outlet context from SeasonNav.tsx
 * @returns 
 * An array consisting of the context and a function to set the context. 
 */
export default function useSeasonDataContext() {
    const context = useOutletContext() as RaceContext

    if ( !context ) {
        throw new Error('Can\'t access this context outside of outlet')
    }

    return context
}