import { create } from 'zustand'
import { persist } from 'zustand/middleware'



const UseAuthStore = create(
    persist((set)=>({
    currentUser : null,
    setCurrentUser : (newUser) =>set({currentUser : newUser}),// backend se aayega
    removeCurrentUser: () =>set({currentUser :null}), // for logout 
    updateCurrentUser : (updateUser) =>set({currentUser: updateUser})// backend se update hoga

})));

export default UseAuthStore