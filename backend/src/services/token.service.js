import jwt from "jsonwebtoken";
import config from "../core/config/index.js";

/**
 * Generate an Access Token
 * @param {string} userId 
 * @returns {string} token
 */
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpiry }
    );
};

/**
 * Generate a Refresh Token
 * @param {string} userId 
 * @returns {string} token
 */
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiry }
    );
};

/**
 * Verify Access Token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.accessSecret);
    } catch (error) {
        return null;
    }
};

/**
 * Verify Refresh Token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret);
    } catch (error) {
        return null;
    }
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
