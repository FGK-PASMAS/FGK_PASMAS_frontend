import type { MenuItem } from "primevue/menuitem";
import type { Component } from "vue";

export interface MenuStepperItemInterface extends MenuItem  {
    /**
     * Vue component of the menu item. 
     */
    component: Component;
}
