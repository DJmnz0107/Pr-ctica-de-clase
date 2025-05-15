/*
Campos:
name
year
slogan
image
*/

import {Schema, model} from "mongoose";

const brandSchema = new Schema(
    {
        name: {
            type:String,
            require:true
        },
        year: {
            type: Number,
            require:true
        },
        slogan: {
            type:String,
            require:true
        },
        image: {
            type:String,
            require:true
        }
    },
    {
        timestamps:true,
        strict:false
    }
);

export default model("Brand", brandSchema)