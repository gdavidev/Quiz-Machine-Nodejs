# Quiz Machine Nodejs
## Initialing in production
For macOS or Linux:
- Make it executable: `chmod +x KerakollQuiz.sh`
- Run it: `./KerakollQuiz.sh`

For Windows:
- You may need to enable script execution first (run as admin): `Set-ExecutionPolicy RemoteSigned`
- Run it: `.\KerakollQuiz.ps1`

## Contributing
After cloning the project you must run the following:
```bash
npm i # Install Node Dependencies

# Excute the following one for each terminal instance
npm run webpack:start # Initialize webpack in development mode
npm run node:start # Initialize webpack in development mode
```
