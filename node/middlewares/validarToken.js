import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        if (!token) throw new Error("No existe el token");

        token = token.split(" ")[1];
        const data = jwt.verify(token, process.env.JWT_SECRET);
        console.log(data)
        req.uid = data.uid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
};