import { useContext } from "react";
import { UserContext } from "../App";

export default function useUserContext() {
    const context = useContext(UserContext)

    if (!context) 
        throw new Error(`useUserContext is being used outside of user context provider`)

    return context
}