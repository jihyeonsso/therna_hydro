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

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# 컨테이너 시작 시 대기 중인 마이그레이션을 적용한 뒤 서버를 기동
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
