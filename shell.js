const { exec } = require("child_process");

exec("gh repo sync jrcribb/rqlite", (error, stdout, stderr) => {
    console.log(`error: ${error}`);

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
});