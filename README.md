# React-Demo for RoboCup WebUI Blockly-Control

## Installation

In the project directory, copy the media/ folder once like this: `cp -r blockly/media/ public/media`. Then run `npm install`.

## Build

Assume we want to deploy the site to the path "/girlsday", then you can do:

```
PUBLIC_URL="/girlsday" npm run build
cp -r blockly/media/ public/media
```

You can find the files to deploy in the build/ folder.

## Execute the Code

`npm start` to run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
