export interface Hotel {
    id: number;
    name: string;
    address: string;
    city: string;
    featuredImage: string;
    rooms: Room[];
}

export interface Room {
    roomId: number;
    roomName: string;
    pricePerNight: number;
    imageUrl: string;
    images: { source: string }[];
    available: boolean;
    maximumGuests: number;
    services: RoomService[];
}

export interface RoomService {
    name: string;
    icon: string;
    description: string;
}

export interface Translation {
    en: string;
    [key: string]: string;
}