import { Restaurant } from "./restaurant";

export interface reservationDto {
    reservationNumber: string,
    restaurant: Restaurant,
    reservationDate: string,
    startTime: string,
    endTime: string,
    nbOfPeople: number,
    clientName: string

}