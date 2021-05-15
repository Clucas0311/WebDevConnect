// mongodb connection
// bring in mongoose to connect
const mongoose = require('mongoose');
// bring in the config package
const config = require('config');
// to get the mongoURI file use config.get
const db = config.get('mongoURI');

const connectDB = async () => {
	try {
		mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log('MongoDB Connected...');
	} catch (err) {
		console.log(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
