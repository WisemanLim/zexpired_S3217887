const express = require("express");
const bodyParser = require("body-parser"); // express 대체 테스트
const { spawn } = require('child_process');
const fs = require('fs');
const { response } = require("express");

const app = express();

// const cors = require("cors");
// var corsOptions = {
//   origin: "http://localhost:8081"
// };
// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
// app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/public/index.html`);
});

// call python : post
app.post("/readPython", (request, response) => {
  // Reading Python files
  var dataToSend;
  // spawn new child process to call the python script
  // const python = spawn('python3', ['public/script.py', "hi", "Duyen"]);
  // const python = spawn('python3', ['caller_node/script2.py', "Params#1"]);
  // const python = spawn('python', ['public/script.py']);
  const python_env = `${__dirname}/python/bin/python3`;
  const python = spawn(python_env, ['public/tensorflow_test2.py', "Params#1"]);

  // collect data from script
  python.stdout.on('data', (data) => {
    dataToSend = data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // in close event we are sure theat stream from child process is closed
  python.on('exit', (code) => {
    console.log(`child process exited with code ${code}, ${dataToSend}`);
    response.sendFile(`${__dirname}/public/result.html`);
  });
})

//Import PythonShell module.
const {PythonShell} =require('python-shell');
const { exit } = require("process");

// call python : post
app.post("/readPython2", (request, response, next) => {
	// Add virtual environment
	const python_env = `${__dirname}/python/bin/python3`;

	//Here are the option object in which arguments can be passed for the test.js.
	let options = {
		mode: 'text',
		pythonPath: python_env, // virtual environment
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: 'public/', //If you are having python_test.py script in same folder, then it's optional.
		args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
	};
	
  // console.log(request.body["module"]);
  let running_module = request.body["module"];

	PythonShell.run(`${running_module}.py`, options, function (err, result){
		if (err) {
      console.error(`stderr: ${err.toString()}`);
      response.send(err.toString())
      // throw err;
    } else {
      // result is an array consisting of messages collected
      //during execution of script.
      console.log(`result: ${result.toString()}`);
      response.send(result.toString())
      // response.sendFile(`${__dirname}/public/result.html`);
    }
	});
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});