# Done

[done] Set up Mongo and Mongoose
[done] Sign in with Dropbox
[done] Show photos from Dropbox
[done] Figure out how to show photos properly. Find something in between raw and thumbnail sizes.

# 23. Sep 2014

[done] Start using Dropbox's API cursors
[done] Improve handling of Dropbox's API change responses (blankSlate, removals)
* Start using S3
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
