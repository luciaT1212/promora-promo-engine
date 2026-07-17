# Promora Promo Engine

Motor de códigos promocionales construido con NestJS. Implementa validaciones encadenadas, reglas configurables, estrategias de descuento `fixed`, `percent` y `tiered`, persistencia PostgreSQL mediante Prisma y repositorios en memoria para pruebas.

La matriz de casos, los resultados y la evidencia están en [QA_REPORT.md](QA_REPORT.md). Las solicitudes para la demostración están en [demo/promo-engine.http](demo/promo-engine.http).

## Instalación

```powershell
npm.cmd install
```

## Ejecución

```powershell
# Aplicación conectada a PostgreSQL
npm.cmd run start:dev

# Demostración aislada con repositorios en memoria
$env:PROMO_USE_IN_MEMORY='true'
npm.cmd run start:dev

# Compilación y ejecución de producción
npm.cmd run build
npm.cmd run start:prod
```

## PostgreSQL y Prisma

Copia `.env.example` como `.env`, configura `DATABASE_URL` y ejecuta:

```powershell
docker compose up -d
docker compose ps
npm.cmd run prisma:validate
npm.cmd run prisma:generate
npm.cmd run prisma:migrate
npm.cmd run prisma:seed
```

La aplicación utiliza PostgreSQL de forma predeterminada. Los repositorios en memoria se seleccionan únicamente en pruebas o al configurar explícitamente `PROMO_USE_IN_MEMORY=true`.

El contenedor `promora-postgres` conserva sus datos en el volumen `promora_postgres_data`. El seed es idempotente y crea promociones `fixed`, `percent` y `tiered`, un comprador, categorías relacionadas y tres órdenes de demostración.

## Calidad y pruebas

```powershell
# Análisis estático
npm.cmd run lint

# Compilación
npm.cmd run build

# Pruebas unitarias
npm.cmd run test:unit

# Pruebas de integración
npm.cmd run test:integration

# Pruebas de extremo a extremo
npm.cmd run test:e2e -- --runInBand

# Cobertura
npm.cmd run test:cov -- --runInBand
```
