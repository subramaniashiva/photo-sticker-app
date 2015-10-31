Photo Sticker App
===================

This is an app that allows users to upload a photo and add a sticker image on the photos by dragging and dropping the sticker images. The sticker images are images of size 150*150 in the sticker library. Initially the sticker library is empty. Users can upload sticker images from their computer. The state of the application is stored in localStorage.

----------
Running the app
-------------
 - Clone the repo
 - `npm install && bower install`
 - `grunt serve` for running the server
 - `grunt build` for generating dist version

Features
-------------

 - The app is scaffolded using yeoman generator
 - This app uses Grunt as its task runner
 - Dependencies are installed using bower
 - ESLinting supported
 - Uses Bootstrap for responsiveness
 - Uses Modernizr for better feature detection
 - No external framework is used. Written in vanialla JavaScript
 - Uses three JS files
	 - **photo-app.js** - This file acts as a model. Photos, stickers in library and their positions on photo are set here. This file acts a data store with getter and setters and it is testable.
	 - **dom-helper.js** - Since I have not used jQuery, this file will contain some useful DOM operations that will be used by the application.
	 - **interactions.js** - This file acts a Controller. All the user interactions, adding, updating DOM based on logic are handled in this file.

Future Improvements
-------------

 - Resize the dropped sticker
 - Save the image once stickers are dropped
 - Add Images from URL
 - Add a loading icon when the file is being uploaded
 - Adding test cases