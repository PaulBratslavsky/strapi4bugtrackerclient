import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null)

export default function UserProvider({ children }) {

    const [user,setUser] = useState(() => {
        const localData = localStorage.getItem("user-admin");
        return localData !== null ? JSON.parse(localData) : null;
    })

    useEffect(() => {
        if (user) window.localStorage.setItem("user-admin", JSON.stringify(user))
        else window.localStorage.clear()
    },[user])

    return <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>
}