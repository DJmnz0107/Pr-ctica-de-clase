import {Schema, model} from "mongoose";
 
const faqsSchema = new Schema ({
    question : {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 100,
        trim: true
    },
    answer : {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 100,
        trim: true
    },
    level : {
        type: Number,
        required: true,
        minLength: 1,
        maxLength: 10,
        requiered: true,
        trim: true
    },
    isActive : {
        type: Boolean,
        required: true,
      default: true,
    }
},{
    timestamps: true,
    strict: false,
}
);
export default model ("faqs", faqsSchema)