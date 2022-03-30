# Blockly robot soccer webapp

For the live version, go to: https://01.rfc-berlin.de/girlsday/

https://user-images.githubusercontent.com/23171985/160791077-8bb720ce-1d7f-480f-bce1-10fde6330f83.mp4

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
