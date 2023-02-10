# Blockly robot soccer web app

A web app based on [Blockly](https://developers.google.com/blockly/) and React to teach the basics of coding and developing robots.
The theme of the web app is the [RoboCup Humanoid League](https://www.robocup.org/leagues/3), in which robots play soccer autonomously.
This web app was developed in the context of the [GirlsDay](https://girls-day.de), which is a Germany-wide event which promotes male-dominated jobs to young women, and where we used this web app to make our work on robots more approachable for the young women.

For the live version, go to: https://01.rfc-berlin.de/girlsday/

https://user-images.githubusercontent.com/23171985/160791077-8bb720ce-1d7f-480f-bce1-10fde6330f83.mp4

## Installation

Before you can build the project, you need to do the following once:

```
cd robocup-blockly/
cp -r blockly/media/ public/media
npm install
```

## Development

Run the web app in the development mode like this:

```
npm start
```

This opens the web app under [http://localhost:3000](http://localhost:3000) in your browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

## Static build for deployment

Assuming you want to host the web app at the path `/girlsday` (eg http://example.com/girlsday):

```
cp -r blockly/media/ public/media
PUBLIC_URL="/girlsday" npm run build
```

You can find the static build in `build/`.
