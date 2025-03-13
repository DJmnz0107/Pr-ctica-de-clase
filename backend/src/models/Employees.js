/*
Campos:
  name
  lastName
  birthday (esto es de tipo Date o lo puden poner como String)
  email
  address
  hireDate (esto es de tipo Date o lo puden poner como String)
  password
  telephone
  dui
  isssNumber
  isVerified (esto es booleano)
  */

  import { Schema, model} from "mongoose";

const employeeSchema = new Schema(

    {
    
        name: {
            type: String,
            require: true
        },
        lastName: {
            type: String,
            require: true
        },
        birthday: {
            type:Date,
            require: true,
        },
        email: {
            type: String,
            require: true
        },
        address: {
            type:String,
            require:true
        },
        hireDate: {
            type:Date,
            require:true
        },
        password: {
            type:String,
            require:true
        },
        telephone: {
            type:String,
            require:true
        },
        dui: {
            type:String,
            require:true
        },
        isssNumber: {
            type:String,
            require:true
        },
        isVerified: {
            type:Boolean,
            require:true
        }
       

    },
    {
        timestamps:true,
        strict:false
    }
    
    );
    
    export default model("Employee", employeeSchema)