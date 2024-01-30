import type { MenuItem } from "primevue/menuitem";

export interface PrimeMenuItem extends MenuItem  {
    /**
     * Own route for navigation purpose when clicking on own icon. 
     */
    route?:string | undefined;
}
