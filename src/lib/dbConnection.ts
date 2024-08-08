import { log } from 'console'
import mongoose from 'mongoose'

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function DBConnection(): Promise<any> {
    if (!connection.isConnected) {
        try {
            const db = await mongoose.connect(process.env.MONGO_ATLAS_URL as string)
            //    console.log(db)
            connection.isConnected = db.connections[0].readyState
        } catch (error) {
            // console.log("Error while connecting ", error);
            //process.exit(1); // It is used to exit from the process entirely if database is not connected.
            console.log("Error")
        }
    }
    else {
        console.log("Already Connected With the Databases");
    }
}

// Ordinary way to do that

// main()
//     .then(() => { console.log('Connected With MongoAtlas Database') })
//     .catch((err) => { console.log('Not Connected : ', err) })

// Above function call will not work here as we are only going to execute the main file not this file so this file is not going to be exectued at all only the function will be called upon the funciton call reference.

export default DBConnection;