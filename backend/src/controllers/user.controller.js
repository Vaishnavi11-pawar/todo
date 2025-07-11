import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcrypt';
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } from "../utils/jwt.js";
import { pool } from "../db/index.js";
import { v4 as uuidv4 } from 'uuid';

export const registerUser = asyncHandler(async (req, res) => {
    try {
        const {username, fullname, email, password } = req.body;
    
        if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All Fields are Required")
        }
    
        const [existedUser] = await pool.query("select * from users where email = ? OR username = ?", [email, username]);
        if (existedUser.length > 0) {
            throw new ApiError(400, "user with existed email and username already exists.");
        }
    
        const userid = uuidv4();
        let hashedPassword = await bcrypt.hash(password, 10);
    
        await pool.query("INSERT INTO users (id, username, password, fullname, email) VALUES (?, ?, ?, ?, ?)", [userid, username, hashedPassword, fullname, email]);
    
        const [createdUser] = await pool.query("SELECT id, username, fullname, email FROM users WHERE email = ? AND username = ?", [email, username]);
    
        return res
            .status(201)
            .json(new ApiResponse(200, createdUser[0], "User registered successfully."));
    
    } catch (error) {
        console.log("error while createing the user: ", error);
    }

})

export const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if(users.length === 0) {
            throw new ApiError(400, "Invalid email or password.");
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password.");
        }

        const tokenPayload = {
            id: user.id,
            email: user.email
        };

        const accessToken = generateToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?", [refreshToken, user.id]);

        delete user.password;
        delete user.refresh_token;

        return res
            .status(200)
            .json({
                status: 'success',
                data: {
                    user,
                    accessToken,
                    refreshToken
                }
            });

    } catch (error) {
        console.log("error while login the user: ", error);
        return res 
         .status(500)
         .json(new ApiError(500, `Internal server error: ${error}`))
    }
})

export const refreshToken = asyncHandler(async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return new ApiError(400, 'Refresh token is required.');
        }

        const decoded = verifyRefreshToken(refreshToken);
        const users = await pool.query("SELECT * FROM users WHERE id = ? AND refresh_token = ?", [decoded.id, refreshToken]);
        if (users.length === 0) {
            return new ApiError(401, 'Invalid refresh token');
        }
        const user = users[0];
        const tokenPayload = {
            id: user.id,
            email: user.email
        }

        const accessToken = generateToken(tokenPayload);
        const newRefreshToken = generateRefreshToken(tokenPayload);
        
        await pool.query("UPDATE users SET refresh_token = ? WHERE id = ?", [newRefreshToken, user.id]);

        return res
            .status(200)
            .json({
                status: 'success',
                data: {
                    accessToken,
                    refreshToken: newRefreshToken
                }
            });

    } catch (error) {
        console.log("error while refreshing the token: ", error);  
    }
})

export const logout = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.query("UPDATE users SET refresh_token = NULL WHERE id = ?", [userId]);

        return res
            .status(200)
            .json({
                status: 'success',
                message: 'Logged out successfully.'
            });
    } catch (error) {
        console.log("error while logging out: ", error);
    }
})