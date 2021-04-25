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

## What works?

You can use the `add robot` block to create a new robot at a given position. You can then move the first robot you created to a new position using the `move robot` block.

## What's left to do?

Um... almost everything!

Drawing
* Scaling of the field
* Field lines
* Robot scaling
* Robot turning
* Ball

Game State
* Ballposition
* Robot rotation and field of view

Physics Engine
* Robot and ball movements dependent on actual time, not update time
* Have a more constant (or another way thought-through) velocity for the objects

Game Logic
* all of it!

