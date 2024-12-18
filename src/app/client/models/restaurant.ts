import { Menu } from "./menu";


export interface Restaurant {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  type: string;
  email: string;
  description: string;
  image: string;
  rating: number;
  openingHours: string;
  closingHours: string;
  capacity: number;
  menuDtoList: Menu[];
  open: boolean;
}
