import { createRouter, createWebHistory } from 'vue-router';
import FlightsView from '@/views/FlightsView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import PassengersView from '@/views/PassengersView.vue';
import PlanningView from '@/views/PlanningView.vue';
import SettingsView from '@/views/SettingsView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMAth(.*)',
            name: 'notFound',
            component: NotFoundView
        },
        {
            path: '/',
            name: 'planning',
            component: PlanningView
        },
        {
            path: '/flights',
            name: 'flights',
            component: FlightsView
        },
        {
            path: '/passengers',
            name: 'passengers',
            component: PassengersView
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsView
        },
    ]
})

export default router
