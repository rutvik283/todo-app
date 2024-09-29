import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const todoSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

todoSchema.plugin(mongooseAggregatePaginate);

export const Todo = mongoose.model("Todo", todoSchema);
