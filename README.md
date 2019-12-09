# web-app-thing
Side project for working on a rewrite of Blockauth. Feel free to use as a boilerplate.

## what have you got
* Basic Bootstrap website
* JWT cookie based auth using Passport
* Discord OAuth

## how 2 use
* Node.js (v12)
* MongoDB

Npm script | Function 
--- | --- 
`prestart` | Start MongoDB 
`start` | Start web server 
`poststop` | Stop MongoDB
`pretest` | Same as `prestart`
`test` | Mocha tests (unused atm)
`posttest` | Same as `poststop`

## things to note
At the moment I'm using CSS from [Finobe](https://finobe.com) because I'm lazy (sorry Raymonf)