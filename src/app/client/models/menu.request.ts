import { Dish } from "./dish";

export interface MenuRequest {
    dishes: Dish[];
    days: string;
    restaurantId: number;
}