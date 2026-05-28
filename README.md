# Template API + PostgreSQL + Docker

## Como usar

1. Renomeie `.env.example` para `.env`
2. Ajuste as variáveis
3. Coloque seus arquivos da API dentro da pasta `api`
4. Ajuste o `package.json`
5. Edite `sql/init.sql` com suas tabelas

## Subir containers

```bash
docker compose up --build
```

## Rodar em background

```bash
docker compose up -d --build
```

## Derrubar containers

```bash
docker compose down
```

## Derrubar removendo banco

```bash
docker compose down -v
```
