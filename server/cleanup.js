const mongoose = require('mongoose');
const User = require('./path/to/models/User'); // Update the path accordingly

const uri = 'your_mongo_uri'; // Replace with your MongoDB connection string

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB connected.');

        // Cleanup logic
        try {
            // Delete users with null userName
            await User.deleteMany({ userName: null });
            console.log('Cleaned up users with null userName.');

            // Optionally, you could update users with null userName
            // await User.updateMany({ userName: null }, { $set: { userName: 'defaultUserName' } });
            // console.log('Updated users with null userName.');

        } catch (error) {
            console.error('Error during cleanup:', error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
    });
