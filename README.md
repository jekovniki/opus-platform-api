<h1 style="text-align:center">Opus Platform API</h1>
<p>This repository holds a NodeJS application for the Opus Platform API</p>
<p>To run this app you will need to have Docker installed on your machine (Docker and docker-compose, but if you are running the desktop version of Docker, you are going to have it(docker-compose) by default)</p>
<h2>Production</h2>
<p>If you want to start this application in production mode, follow these steps:</p>
<ol>
    <li>Clone the repository in folder by choice with `git clone git@github.com:jekovniki/opus-platform-api.git`</li>
    <li>`cd api`</li>
    <li>Copy `.env.default` and paste it in the same place, just rename it to `.env`</li>
    <li>* If necessary change ports, if not you can keep the default ports</li>
    <li>Execute `docker-compose up`</li>
</ol>
<p>After that the services should be available on the ports in your .env file</p>

<h2>Development</h2>
<p>If you are developer and you want to run the application in development mode, follow these steps:</p>
<ol>
    <li>Clone the repository in folder by choice with `git clone git@github.com:jekovniki/opus-platform-api.git`</li>
    <li>`cd api`</li>
    <li>Copy `.env.default` and paste it in the same place, just rename it to `.env`</li>
    <li>* If necessary change ports, if not you can keep the default ports</li>
    <li>Run `npm install`</li>
    <li>Go into the docker-compose file and comment out the `api` service. So you can use the docker-compose only for infra</li>
    <li>Execute `docker-compose up`</li>
    <li>Run `npm run start:dev`</li>
</ol>
<h2 style="text-align:center">API Documentation</h2>
<p>The API Documentation is generated via Postman. Use the json file inside of your Postman in order to visualize all of the API calls. </p>