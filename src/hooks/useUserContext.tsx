import { useContext } from "react";
import { UserContext, UserTypes } from "../App";

/**
 * A hook to consume user context.
 * @returns An array that includes the context and a function to set the context.
 */
export default function useUserContext(): [UserTypes['user'], UserTypes['setUser']] {
    const context = useContext(UserContext) as UserTypes

    if (!context) 
        throw new Error(`useUserContext is being used outside of user context provider`)

    return [context.user, context.setUser]
}