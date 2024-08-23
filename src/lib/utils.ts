import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    // px-2 and py-2 will result in p-2 with twMerge
    // clsx helps in handling conflicts if the classes , example bg-black bg-white
    return twMerge(clsx(inputs))
}