const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/pull', (req, res) => {
  if (req.body.ref === 'refs/heads/main') { // Change 'main' to your branch name
    console.log('Commit received.');
    console.log('Author:', req.body.head_commit.author.name);
    console.log('Message:', req.body.head_commit.message);
    console.log('');
    console.log('Attempting to pull the code changes...');
    console.log('');
    //exec('cd /app/project_root && git pull && docker-compose down && docker-compose up -d --build', (error, stdout, stderr) => {
    exec('cd /app/project_root && git pull', (error, stdout, stderr) => {
        if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send('Error');
      }
      console.log(`${stdout}`);
      if (stderr) {
        console.error(`${stderr}`);
      };
      return res.status(200).send('Success');
    });
  } else {
    res.status(200).send('No action taken');
  }
});

app.listen(3000, () => {
  console.log('Webhook handler listening on port 3000');
});