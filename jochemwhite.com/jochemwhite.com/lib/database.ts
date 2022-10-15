import mongoose, { ConnectOptions } from "mongoose"
import { Error } from "mongoose";


const connect = async () => {
  await mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  } as ConnectOptions)

  .catch((err: Error) => {
    console.log(
      `Initial Distribution API Database connection error occured -`,
      err
    );
  });
};

export default connect;





