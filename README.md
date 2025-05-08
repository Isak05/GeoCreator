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
Development:
```bash
docker compose -f docker-compose.dev.yml up --build -d
```
Production:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Local
Development:
```bash
npm install
npm run dev
```

Production:
```bash
npm install
npm run build
npm run start
```