# Pingo backend
Pingo is real-time travel experience sharing mobile application.
This repository is backend of service Pingo. <br>
Our backend has built with Node.js, Gulp, Tape, LevelDB etc. For more detail, check out [Development Guide](https://github.com/sv-bootcamp/wiki/wiki/Development-Guide). <br>
Pingo is result of [project-goober](https://github.com/sv-bootcamp/wiki/wiki/Project-Goober). And Here is our [mobile repository](https://github.com/sv-bootcamp/goober-mobile).

# Quick start
    npm install                  // Install
    npm run watch OR gulp watch  // Running Service
    npm test                     // Running Tests
    npm run lint                 // Linting (Code Analysis)


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

* Run new container

        docker run -p 80:5000 --env-file env.list <IMAGE-ID> &

* Stop container

        docker stop <CONTAINER-ID>

* Show running or all docker containers

        docker ps        docker ps -a

* Remove image or container

        docker rmi <IMAGE-ID>         docker rm <CONTAINER-ID>

* Attach, Restart

        docker attach <CONTAINER-ID>        docker restart <CONTAINER-ID>

* Show log

        docker logs <CONTAINER-ID>

