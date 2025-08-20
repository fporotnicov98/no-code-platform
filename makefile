docker compose restart frontend
# если менял зависимости/конфиг
docker compose down && docker compose up --build