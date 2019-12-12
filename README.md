![Logo](https://raw.githubusercontent.com/Ahe4d/web-app-thing/master/public/img/logo.png)
# web-app-thing
Side project for working on a rewrite of Blockauth. Feel free to use as a boilerplate.

## what have you got
* Basic Bootstrap website
* EJS templating (Vue soon?)
* Customizable logger using Winston
* Mongo admin panel
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