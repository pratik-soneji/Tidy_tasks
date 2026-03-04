import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const noteSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
      },
      title: { 
        type: String,
        default: "" 
      },
      text: { 
        type: String,
        default: "" 
      },
      labels:{
        type:Array
      }
      ,
      color: { type: String },
      collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      archived: { type: Boolean, default: false },
      reminder: { type: Date },
      backgroundImage: { type: String }, 
    },{
timestamps:true
})

noteSchema.plugin(mongooseAggregatePaginate)//for writing aggregation queries

const Note = mongoose.model('Note',noteSchema)

export { Note}