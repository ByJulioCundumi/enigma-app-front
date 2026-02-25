import { createSlice } from '@reduxjs/toolkit'

export interface INavbar{
    homePage: string
}

const initialState = {
  homePage: "home",
}

const NavbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    
  },
})

export const { } = NavbarSlice.actions
export default NavbarSlice.reducer