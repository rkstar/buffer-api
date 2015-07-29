buffer-api
===============

A wrapper for the Buffer (bufferapp.com) API

## Package Dependencies
* underscore
* http
* [accounts-buffer](https://github.com/rkstar/accounts-buffer)

## Usage
1. `meteor add rkstar:buffer-api`
2. Use inside `Meteor.method()` calls only! Future versions may allow you to make calls directly from the client, but this is server only for now.

## Methods (server)
# user
* `user(function(err, response))`
https://buffer.com/developers/api/user#user

# info
* `info(function(err, response))`
https://buffer.com/developers/api/info#configuration

# profiles
* `profiles(function(err, response))`
https://buffer.com/developers/api/profiles#profiles

# schedules
* `schedules.info(profileId, function(err, response))`
https://buffer.com/developers/api/profiles#schedules

* `schedules.update(profileId, paramsObject, function(err, response))`
https://buffer.com/developers/api/profiles#schedulesupdate

# updates
* `updates.byId(updateId, function(err, response))`
https://buffer.com/developers/api/updates#updatesid

* `updates.pending(profileId, paramsObject, function(err, response))`
https://buffer.com/developers/api/updates#updatespending

* `updates.sent(profileId, paramsObjecct, function(err, response))`
https://buffer.com/developers/api/updates#updatessent

* `updates.interactions(updateId, paramsObject, function(err, response))`
https://buffer.com/developers/api/updates#updatesinteractions

* `updates.reorder(profileId, paramsObject, function(err, response))`
https://buffer.com/developers/api/updates#updatesreorder

* `updates.shuffle(profileId, paramsObject, function(err, response))`
https://buffer.com/developers/api/updates#updatesshuffle

* `updates.add(paramsObject, function(err, response))`
https://buffer.com/developers/api/updates#updatescreate

* `updates.update(updateId, paramsObject, function(err, response))`
https://buffer.com/developers/api/updates#updatesupdate

* `updates.share(updateId, function(err, response))`
https://buffer.com/developers/api/updates#updatesshare

* `updates.destroy(updateId, function(err, response))`
https://buffer.com/developers/api/updates#updatesdestroy

* `updates.bump(updateId, function(err, response))`
https://buffer.com/developers/api/updates#updatesmovetotop

# links
* `links.shares(url, function(err, response))`

## Methods (client)
There are no methods available on the client at this time.

## Reading
[Buffer API](https://buffer.com/developers/api)