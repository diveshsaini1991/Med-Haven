import mongoose from 'mongoose';

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to database!');
    })
    .catch((err) => {
      console.log(
        'some error occured while connecting to the database: ' + err
      );
    });
};
