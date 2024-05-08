import mongoose from "mongoose";

const SubscribersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    subscribedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    status: { type: String, required: true, default: "subscribed" },
    subscribedAt: { type: Date, required: true, default: Date.now() },
  }
);

const Subscribers =
  mongoose.models.subscribers ||
  mongoose.model("subscribers", SubscribersSchema);

export default Subscribers;
