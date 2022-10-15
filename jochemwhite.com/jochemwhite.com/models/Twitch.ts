import mongoose ,{ Schema, model, connect, Model } from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface ITwitch {
    TwitchID: string
    name: string;
    email: string;
    avatar?: string;
    accessToken: string;
    refreshToken: string;
    queue?: [];    
    tokens: string[]
}

// 2. Create a Schema corresponding to the document interface.
const twitchSchema = new Schema<ITwitch>({
    TwitchID:  { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
    accessToken: String,
    refreshToken: String,
    queue: [String],
    tokens: [String]
})

let Twitch: any

try {
    Twitch = mongoose.model<ITwitch>("TwitchUsers");
  } catch (err) {
    console.log(err)
    Twitch = mongoose.model<ITwitch>("TwitchUsers", twitchSchema);
  }
  



export default Twitch;