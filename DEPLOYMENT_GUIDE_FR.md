DEPLOIEMENT AVEC DOCKER ET CAPROVER


######################################## Mettre à jour le système

sudo apt-get update


######################################## Installer Docker

sudo apt install docker.io

Pour voir la version de Docker installé : docker --version

Pour vérifier que Docker est actif : sudo systemctl status docker

Dans le cas où Docker est inactif : sudo systemctl enable --now docker

Pour tester que Docker est bien connecté avec le hub : sudo docker run hello-world qui devrait afficher un message semblable à :

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
b8dfde127a29: Pull complete 
Digest: sha256:f2266cbfc127c960fd30e76b7c792dc23b588c0db76233517e1891a4e357d519
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/


################################################################################ Installer CapRover

######################################## Configurer le firewall

sudo ufw allow 80,443,3000,996,7946,4789,2377/tcp
sudo ufw allow 7946,4789,2377/udp


######################################## Installer CapRover

sudo docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover

Puis attendre 60 secondes avant d'essayer de se connecter à CapRover


######################################## Créer une wild card sur votre nom de domaine

Aller sur le compte OVH pour voir le nom de domaine, puis aller dans la zone DNS et ajouter une entrée : champs de pointage = A

### Une nouvelle fenêtre va apparaitre :

sous-domaine = *.demo
TTL = 600 s. (peut être laissé en défault)
cible = [adresse IP du serveur]

Puis faire suivant.

### La prise en compte peut être faite dans les 24h, pour vérifier si la modification a bien été prise en compte, aller sur https://mxtoolbox.com/DNSLookup.aspx

domain name : randomthing123.demo.[nom de domaine].fr

Si vous voyez l'adresse IP, la modification a bien été prise en compte

### Modifier la cible des domaines pour pointer sur la bonne adresse IP


######################################## Installer CapRoverCLI

Vérifier que Node et NPM sont installer sur le serveur : node --version et npm --version
Si ce n'est pas le cas : sudo apt install nodejs et sudo apt install npm

Ensuite : sudo npm install -g caprover
Puis : caprover serversetup

Plusieurs questions seront posées :
1. have you already started CapRover container on your server? YES
2. IP address of your server: 51.210.242.166
3. CapRover server root domain: demo.[nom de domaine].fr
4. new CapRover password: *******
5. enter new CapRover password again: *******
6. "valid" email address to get certificate and enable HTTPS: ****@gmail.com
7. CapRover machine name, with whom the login credentials are stored locally: captain-01

Nous pouvons maintenant acceder à CapRover : captain.demo.[nom de domaine].fr


################################################################################ Création du back

######################################## Ajout des fichiers pour la construction du back

### Ajouter un fichier à la racine "captain-definition" et mettre :
{
    "schemaVersion" :2,
    "dockerfilePath": "./Dockerfile"
}

### Ajouter un fichier à la racine "Dockerfile" et mettre :
FROM node:14.15

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g db-migrate
RUN npm install -g db-migrate-mysql

COPY . .

CMD [ "npm", "start" ]

!!! Bien s'assurer que "migrate-db" fait bien parti du script "start" pour la création des tables automatique dans la base de donnée.

######################################## Créer la base de donnée

Dans l'onglet Apps cliquer sur One-Click Apps/Databases et selectionner MySQL

### Lors de l'installation une page de question :
App name : api
MySQL version : 5.7
MySQL Root password : [DB_PASS]

Et cliquer sur Deploy


######################################## Créer l'interface admin de la BDD

Dans l'onglet Apps cliquer sur One-Click Apps/Databases et selectionner PHPMyAdmin

App name : db-admin

Et cliquer sur Deploy

### Aller sur la liste des Apps et selectionner db-admin
Cliquer sur "Enable HTTPS" et cocher la case "Force HTTPS by redirecting all HTTP traffic to HTTPS"

### Cliquer sur Save & Update

### Aller sur https://db-admin.demo.[nom de domaine].fr
Serveur : srv-captain--api-db
Utilisateur : root
Mot de passe : [DB_PASS]

Ensuite, soit créer une nouvelle base ou en importer une existante


######################################## Créer l'API

### Ecrire "api" dans l'input, cocher "Has Persistent Data" et cliquer sur "Create New App"

### Cliquer sur l'app nouvellement créée, cliquer sur "Enable HTTPS", cocher la case "Force HTTPS by redirecting all HTTP traffic to HTTPS" et mettre dans le "Container HTTP Port" : 8000
Cliquer sur Save & Update

### Aller dans App Configs
Cliquer sur "Bulk Edit" à droite et mettre dans l'input :

SERVER_PORT=8000
DB_HOST=srv-captain--api-db
DB_PORT=3306
DB_USER=root
DB_PASS=[DB_PASS]
DB_NAME=[DB_NAME]
SECRET_JWT=[SECRET_JWT]
CLIENT_URL=www.[nom de domaine].fr
IMAGE=public/images
EMAIL_HOST=[YOUR_CONFIG]
EMAIL_PORT=[YOUR_CONFIG]
EMAIL_SECURE=[YOUR_CONFIG]
EMAIL_TO_SEND=[YOUR_CONFIG]
EMAIL_USED=[YOUR_CONFIG]
EMAIL_PASSWORD=[YOUR_CONFIG]

Cliquer sur "Add Persistent Directory":
Path in App : /usr/src/app/file-storage
Label : file-storage

Cliquer sur Save & Update

### Aller dans Deployment
Aller dans "Method 3", remplir les infos du dépôts du back, les codes d'accès et cliquer sur "Save & Update"
Copier la valeur apparue en dessous de Method 3 et aller dans Github
Aller dans Settings, puis dans Webhooks et cliquer sur "Add webhooks"
Copier dans Payload URL le lien récupéré précédemment et cliquer sur "Add webhooks"


######################################## Mise en place d'un stockage de fichiers

### Prérequis dans le back pour que le stockage de fichier fonctionne
Avoir une variable d'environnement (ex: IMAGE) dans le back qui renvoi vers le dossier de stockage des images

### Dans l'onglet Apps cliquer sur One-Click Apps/Databases et selectionner filebrowser
App name : filebrowser

Cliquer sur Deploy

### Aller sur la liste des Apps et selectionner filebrowser
Cliquer sur "Enable HTTPS" et cocher la case "Force HTTPS by redirecting all HTTP traffic to HTTPS"

Cliquer sur Save & Update

### Aller dans App Configs
Dans la catégorie Persistent Directories, changer le label de "/srv" et mettre "file-storage"

Cliquer sur Save & Update

### Aller sur https://filebrowser.demo.[nom de domaine].fr
Se connecter avec admin/admin

Aller dans Settings et changer le mot de passe

### Configurer la variable dans l'api
Retourner dans la liste des apps et selectionner "api", aller dans "App Configs"
Cliquer sur "Add Key/Value Pair" et mettre "IMAGE" puis "/usr/src/app/srv"

Cliquer sur Save & Update


################################################################################ Création du front

######################################## Ajout des fichiers pour la création du build

### Ajouter un fichier à la racine "captain-definition" et mettre :
{
  "schemaVersion": 2,
  "dockerfilePath" :"./Dockerfile"
}

### Ajouter un fichier à la racine "Dockerfile" et mettre :

# build environment
FROM node:9.6.1 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ARG REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ARG REACT_APP_NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${REACT_APP_NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV REACT_APP_NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${REACT_APP_NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
COPY . /usr/src/app
RUN npm install
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
RUN mkdir -p /etc/nginx/conf.d
COPY ./default.conf /etc/nginx/conf.d/
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

### Ajouter un fichier à la racine "default.conf" et mettre :

server {
  listen 80;
  location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root   /usr/share/nginx/html;
  }
}


######################################## Dans CapRover

### Aller dans "Create A New App", écrire app dans l'input et cliquer sur "Create New App"

Cliquer sur "Enable HTTPS", renseigner le nom de domaine dans l'input juste en dessous et cliquer sur "Connect New Domain".
Cliquer sur "Enable HTTPS" pour le nom de domaine que nous venons d'ajouter puis cliquer sur "Force HTTPS by redirecting all HTTP traffic to HTTPS"

Cliquer sur "Save & Update"

### Aller dans "App Configs"

Cliquer sur "Add Key/Value Pair" et mettre :
premier input : REACT_APP_API_URL
deuxième input : https://api.demo.partirauvert.fr

Cliquer sur "Save & Update"

### Aller dans "Deployment"

Aller dans "Method 3", remplir les infos du dépôts du front, les codes d'accès et cliquer sur "Save & Update"
Copier la valeur apparue en dessous de Method 3 et aller dans Github
Aller dans Settings, puis dans Webhooks et cliquer sur "Add webhooks"
Copier dans Payload URL le lien récupéré précédemment et cliquer sur "Add webhooks"
