# Blockly robot soccer webapp

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

Run the webapp in the development mode like this:

```
npm start
```

This opens the webapp under [http://localhost:3000](http://localhost:3000) in your browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

## Static build for deployment

Assuming you want to host the webapp at the path `/girlsday` (eg http://example.com/girlsday):

```
cp -r blockly/media/ public/media
PUBLIC_URL="/girlsday" npm run build
```

You can find the static build in `build/`.
