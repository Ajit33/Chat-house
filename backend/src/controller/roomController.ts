
import { Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { room } from "../model/RoomModel";
export async function getAllRoomsController(req: Request, res: Response): Promise<void> {
    const token = req.cookies?.token; // Access the token from cookies

    try {
        if (!token) {
            res.status(404).json({
                error: "Token not found!",
            });
            return;
        }

        const secret = process.env.JWT_SECRET as string;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        // Decode the JWT token
        const decoded = jwt.verify(token, secret) as JwtPayload;

        if (typeof decoded !== "object" || !decoded._id) {
            res.status(400).json({
                error: "Invalid token structure.",
            });
            return;
        }

        const userId = decoded._id;

        // Find all rooms where the user is a member
        const userRooms = await room.find({ members: userId });

        res.status(200).json({
            message: "Rooms retrieved successfully.",
            data: userRooms,
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({
            error: "An unexpected error occurred while fetching rooms.",
        });
    }
}

