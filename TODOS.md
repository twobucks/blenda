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
* Save photos stored on S3 into the DB
* Most basic photo page (with bigger resolution)

# Later

* Figure out how to cache stuff. Do we cache stuff? Redis?
* Photo upload (to Dropbox)
* Likes and followers
* Display trending photos on the main page
* Proper notifications and progress bar


# brain.dump

* do we need to add support for backoff and pullAgain for Dropbox change?
> probably not, but okay

* polling for Dropbox changes, how should that be achieved?
> button for syncing with dropbox and web hooks support

* pngs and libvips errors: https://github.com/lovell/sharp/issues/73

