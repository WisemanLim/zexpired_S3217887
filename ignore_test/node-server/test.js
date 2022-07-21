//Import express.js module and create its variable.
const express=require('express');
const app=express();

//Import PythonShell module.
const {PythonShell} =require('python-shell');

//Router to handle the incoming request.
app.get("/", (req, res, next) => {
	// Add virtual environment
	const python_env = `${__dirname}/caller_node/bin/python3`;

	//Here are the option object in which arguments can be passed for the test.js.
	let options = {
		mode: 'text',
		pythonPath: python_env, // virtual environment
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: 'caller_node/', //If you are having python_test.py script in same folder, then it's optional.
		args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
	};
	
	// PythonShell.run('test.py', options, function (err, result){
	// PythonShell.run('crawler.py', options, function (err, result){
	PythonShell.run('tensorflow_test.py', options, function (err, result){
		if (err) throw err;
		// result is an array consisting of messages collected
		//during execution of script.
		// console.log('result: ', result.toString());
		console.log(result);
		res.send(result.toString())
	});
});

//Creates the server on default port 8000 and can be accessed through localhost:8000
const port=8000;
app.listen(port, ()=>console.log(`Server connected to ${port}`));