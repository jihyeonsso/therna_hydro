# ThermaVita Hydro 사용 가이드 앱 — 배포용 Docker 이미지
# Prisma CLI(마이그레이션)가 런타임에도 필요해서 standalone 빌드 대신
# 일반 node_modules를 그대로 포함하는 단순한 구성을 사용함.

FROM node:22-bookworm-slim

WORKDIR /app

# Prisma(SQLite 엔진)가 필요로 하는 라이브러리
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# prisma.config.ts가 빌드 시점(스키마 로딩용)에도 DATABASE_URL 존재를 요구함.
# 실제 DB 연결은 안 하므로 값 자체는 의미 없음 — 런타임엔 docker-compose의 값으로 덮어써짐.
ENV DATABASE_URL="file:./prisma/dev.db"

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# 컨테이너 시작 시 대기 중인 마이그레이션을 적용한 뒤 서버를 기동
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
