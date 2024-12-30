import 'dotenv/config';
import Test from "../models/Test.js";

export const getTest = async (req, res) => { 
    try {
        const test = await Test.findByPk('OK');
        res.status(200).json(test.msg);
    } catch (error) {
        console.log(error);
        return res.status(500).json("BAD");
    }
};

