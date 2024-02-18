import type { MenuItem } from "primevue/menuitem";

export interface MenuItemInterface extends MenuItem  {
    /**
     * Own route for navigation purpose when clicking on own icon. 
     */
    route?:string | undefined;
}
