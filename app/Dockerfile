#Part 1
FROM node:12.2.0-alpine

RUN apk upgrade --no-cache --update && \
    apk add --no-cache curl

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 CMD curl -f http://localhost:8080/v1/ping || exit 1

# Copy Source code and set working directory
WORKDIR /home/node/app
COPY . .

#Run local build
RUN npm prune && \
    npm install --prod && \
    npm run prestart:prod && \
    rm -rf test src .prettierrc Dockerfile nest-cli.json nodemon-debug.json nodemon.json package-lock.json package.json tsconfig.build.json tsconfig.json tslint.json

# Set To non root user
USER node

EXPOSE 8080

CMD ["/bin/sh", "-c", "node dist/main.js"]
