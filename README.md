```sh
#run backend with databse
docker compose -f backend/docker-compose.yaml up --build -d
#run frontend
cd frontend
npm run dev
```