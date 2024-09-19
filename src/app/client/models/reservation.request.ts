export interface reservationRequest {
    restaurantId: number,
    reservationDate: string,
    startTime:string,
    endTime: string,
    nbOfPeople: number,
    clientName: string,
}