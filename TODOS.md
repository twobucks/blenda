# Done

[done] Set up Mongo and Mongoose
[done] Sign in with Dropbox
[done] Show photos from Dropbox
[done] Figure out how to show photos properly. Find something in between raw and thumbnail sizes.

# 23. Sep 2014

[done] Start using Dropbox's API cursors
[done] Improve handling of Dropbox's API change responses (blankSlate, removals)

# 24. Sep 2014
[done] add button for syncing with Dropbox

# 25. Sep 2014
[done] Ditch Kue in favor of Bull - changed my mind

# 26. Sep 2014
[done] Start streaming from Dropbox to S3
[done] Stream multiple photos and multiple photo sizes in paralel

# 27. Sep 2014
[done] Save photos stored on S3 into the DB
[done] Use Redis for session storage

# 09. Oct 2014
[done] basic horizontal scrolling with keyboard arrows
[done] Animate scrolling effect

# 10. Oct 2014
[done] Center images and focus out other images

# 13. Oct 2014
* Create photo grid for the main page (http://tympanus.net/codrops/2014/05/15/recreating-the-design-samsung-grid-loading-effect/)

* Create signup page (http://tympanus.net/Development/AnimatedResponsiveImageGrid/index3.html)
* Most basic photo page (with bigger resolution)
* Gravatar
* Proper notifications and progress bar
* Likes and followers
* Display trending photos on the main page
* Photo upload (to Dropbox)
* Dropbox supports web hooks for changes, we should support it too
* Horizontal scroll with mouse? watch out, this shit is weird - spent 2 hrs on it and did nothing

# brain.dump

* do we need to add support for backoff and pullAgain for Dropbox change?
> probably not, but okay

* pngs and libvips errors: https://github.com/lovell/sharp/issues/73

# answers

* polling for Dropbox changes, how should that be achieved?
> button for syncing with dropbox and web hooks support

* Figure out how to cache stuff. Do we cache stuff? Redis?
> no
