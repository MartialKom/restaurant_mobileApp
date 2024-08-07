import { Dish } from "./dish";

export interface Menu {
    dishes: Dish[];
    days: string[];
}