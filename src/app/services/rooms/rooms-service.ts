import { RoomService } from "../hotels/hotels";

export const ROOM_SERVICES: RoomService[] = [
    { 
        name: 'WiFi', 
        icon: '/assets/icons/wifi.svg', 
        description: 'მაღალი სიჩქარის ინტერნეტ კავშირი ყველა თქვენი მოწყობილობისთვის.' 
    },
    { 
        name: 'Air Conditioning', 
        icon: '/assets/icons/ac.svg', 
        description: 'იყავით კომფორტულად და სასიამოვნო ტემპერატურაზე ოთახში.' 
    },
    { 
        name: 'Breakfast', 
        icon: '/assets/icons/breakfast.svg', 
        description: 'დაიწყე გემრიელი საუზმით, რომ დაიწყო დღე ლაღად.' 
    },
    { 
        name: 'Swimming Pool', 
        icon: '/assets/icons/pool.svg', 
        description: 'განიტვირთეთ გადატვირთული დღის შემდეგ.' 
    },
    { 
        name: 'Fitness Center', 
        icon: '/assets/icons/fitness.svg', 
        description: 'იყავი აქტიური და ჯანმრთელი ჩვენი სრულად აღჭურვილი ფიტნეს ცენტრით.' 
    },
];
