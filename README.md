# Geonetwork Explorer

A simple frontend application that may be used to browse [Geonetwork](https://www.github.com/geonetwork/core-geonetwork) data.

Geonetwork is a geographical metadata catalog and is able to store its catalog entires (also known as _records_ or _metadata_) in an ElasticSearch instance.

By using the versatility of the ElasticSearch API, this application allows seamless exploration of data through space, time and ~~matter~~ full text search.

## How it works

The build chain is handled with Webpack and produces bundled javascript and CSS.

UI is rendered using React components.

The application state is managed with Redux and the React-Redux module.

The map library used is OpenLayers.

## Usage

As usual, `npm install` will get you all the dependancies and `npm run build` will build the files in the `dist` folder.

`npm run dev` will start the application in development mode, i. e. hosted on a dev server with file watching and unminified code.
