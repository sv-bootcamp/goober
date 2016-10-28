# This is Goober's base code. You can build up from this. It is done by deleting unnecessary parts from sv-bootcamp/example-project.
# Install
npm install
# Running Service
npm run watch
or
gulp watch
# Running Tests
npm test
# Linting (Code Analysis)
npm run lint

# Docker
Every commit of master branch makes docker image file and push to docker-hub <br>
For update docker image of EC2 instance follow description below

* Connect to instance with your .pem file

        ssh -i my.pem user-id@public-dns-address.com
* Login to docker and enter email, password and username

        docker login
        username:
        password:
        email:

* Pull from docker-hub

        docker pull docker-hub-user/docker-hub-repository
        latest: Pulling from docker-hub-user/docker-hub-repository
        bdaad1adsfas: Pull complete
        0a14a6d7123a: Pull complete
        7eec34458203: Pull complete
        .......................

* Run server

        docker run -p 80:5000 <IMAGEID> &

* Stop server

        docker stop <IMAGEID>

* Show running docker containers

        docker ps