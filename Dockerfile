FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /fashionhub-tests

COPY package*.json ./

RUN npm ci

COPY . .
CMD ["npx", "playwright", "test"]