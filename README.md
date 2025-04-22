# Geocreator

## Wiki
[https://gitlab.lnu.se/1dv613/student/ij222pv/project/-/wikis/home](https://gitlab.lnu.se/1dv613/student/ij222pv/project/-/wikis/home)

## Running
### Environment variables
`PORT` - Port to run the server on. Default is 80
`MONGODB_URI` - MongoDB connection string
`NODE_ENV` - Environment to run the server in. Default is production
`BASE_URL` - Base URL for the server
`SESSION_NAME` - Name of the session cookie
`SESSION_SECRET` - Secret for the session cookie

### Docker
Create image:
```bash
docker build -t geocreator .
```

Run image:
```bash
docker run -d --env-file .env -p 80:80 --name geocreator geocreator
```
