# Fitverse - full-stack team project for the Code Nation Bootcamp

This is the **back-end** API of the app, for the front-end see this repository: [CodeNation-FinalProject-FrontEnd](https://github.com/bar-alex/CodeNation-FinalProject-FrontEnd)

The app is also live on Netlify at [https://cn-m37-fitness.netlify.app/](https://cn-m37-fitness.netlify.app/)

The API uses a MongoDB database through Mongoose.

The available endpoints are documented here: [endpoints.txt](src/doc/endpoints.txt)

The structure of the collections is documented here: [structure.txt](src/doc/structure.txt)

If you are cloning this project, you need to create a ```.env``` file in the root of your project, that will contain the following lines:
```
MONGO_URI = mongodb+srv://<user>:<pass>@cluster0.mud1fky.mongodb.net/<db-name>?retryWrites=true&w=majority
JWT_SECRET_KEY = <secret-key-string>
PORT = 5001
```
where the values for ```user```, ```pass```, ```db-name``` and ```secret-key-string``` need to be your own.
