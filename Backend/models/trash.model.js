import mongoose from "mongoose";

const trash = new mongoose.Schema({
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
      labels: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Label'
      }],
      collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      color: { type: String },
      archived: { type: Boolean, default: false },
      reminder: { type: Date },
      backgroundImage: { type: String }, 
    },{
timestamps:true
})

const Trash = mongoose.model('Trash',trash)

export  {Trash}
