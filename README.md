# Simple Timeline
## A tool to visualize the passing of time

This was initially a school project. I enjoy using it to keep track of my life, so I revived it and even gave it on its own domain.
www.simple-timeline.com

## Contributing
Honestly, this project is a mess. The first version was built with JQuery and vanilla PHP (LAMP). By a student.

I've since simplified the architecture to keep the app focused on a single workflow: local files.

Replaced JQuery with Svelte and Sapper. (But you can still feel JQuery's ghost in the way code is organized/unorganized. Yes, I know, I'm the one to blame for that, not JQuery.)

This project now works entirely with local import/export of timeline files. There is no auth flow and no database backend.

I never wrote a single test 🤠

So, if you feel like contributing, maybe send me a message and I'll help you out. 
At the time of writing, Simple Timeline does what I need it to do and, even though the code is as ugly as its UI/UX, I need to move on to more important projects. 

Don't fear using it though! 
Again, it does what I intented it to do beautifully: timelines.

## Shoutout
This project relies heavily on [vis-timeline](https://github.com/visjs/vis-timeline) by [vis.js](https://visjs.org/).
