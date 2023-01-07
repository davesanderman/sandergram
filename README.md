# Sandergram

Sandergram is a tool and framework to assist with solving puzzle-hunt-style 
word puzzles.  It started as a tool for quickly finding simple anagrams, and has
had other tools added to it, most of which are of extremely limited value.

## Setup

Get a word list to use.  This has currently been tested with UKACD 1.7, but it should
work with any one-word-per-line word list.  It's currently stupid about line endings,
though, and expects Windows-style CRLF line endings.

Edit src/Constants.ts to specify the deployed path (if you want to deploy anywhere other
than the root directory of a server) and the path to where the word list can be fetched.
Beware CORS issues if you're hosting the word list on a separate server.

## Running

`npm run start` runs a local copy.  For local testing, you'll probably want to have
DEPLOYED_BASE_PATH be empty.

## Deploying

This is a React SPA.  `npm run build` will build a deployment-ready production-mode build.
