<p align="center">
  <img src="https://cdn.rawgit.com/sqmk/huejay/8ca17db521eab6dbcfeabf93483f2700d7aa44bb/media/logo.svg" alt="Huejay" />
</p>

# Huejay - Philips Hue client for Node.js

[![NPM Version](https://badge.fury.io/js/huejay.svg)](https://www.npmjs.com/package/huejay)
[![Build Status](https://api.travis-ci.org/sqmk/huejay.svg?branch=master)](https://travis-ci.org/sqmk/huejay)

Huejay is a client for the Philips Hue home lighting system.

Use Huejay to interact with Philips Hue in the following ways:
* Bridge discovery
* Manage bridge settings
* Manage portal settings
* Manage software updates
* Manage users
* Manage lights
* Manage groups
* Manage schedules
* Manage scenes
* Manage sensors
* Retrieve and delete rules

## Installation

Huejay was written for **Node.js 4+**.

`npm install --save huejay`

## Basic Usage

Requiring the library is simple:

```js
let huejay = require('huejay');
```

Most methods return a **Promise** as a result.

### Bridge Discovery

Before interacting with your Hue system, you may want to know the availability
and IP addresses of your bridges. You can use Huejay's **discover** method to find
them.

```js
huejay.discover()
  .then(bridges => {
    for (let bridge of bridges) {
      console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
    }
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`);
  });
```

Huejay offers several strategies for bridge discovery:
* **nupnp**: Default option, uses Meethue's public API to discover local bridges
* **upnp**: Uses SSDP to discover local bridges
* **all**: Uses all available strategies for discovery

To use a specific discovery strategy:

```js
huejay.discover({strategy: 'upnp'})
  .then(bridges => {
    console.log(bridges);
  });
```

### Errors

Nearly all errors returned by Huejay will of type `huejay.Error`. Use this to
check Huejay specific errors.

## Client Usage

You can use Huejay to retrieve and manipulate resources on your preferred bridge.
Resources include users, lights, groups, scenes, and others.

To start, you must instantiate a client. The **Client** class is available for
convenience via Huejay;

```js
let client = new huejay.Client({
  host:     '123.0.12.34',
  port:     80,               // Optional
  username: 'bridgeusername', // Optional
});
```

If a *username* is not provided, nearly all commands will fail due to failure to
authenticate with the bridge. Be sure to provide a valid *username* to use all
client commands.

### User management

Huejay provides several commands for managing users on Philips Hue bridges.

#### client.users.create - Create user

You can use Huejay to create users on the bridge. Creating a user requires the
bridge's link button to be pressed. The link button is activated for roughly
30 seconds.

To create a user, instantiate a **User** object and pass it to `client.users.create`.
On successful creation, a brand new **User** object is returned by way of a Promise.
The **User** object will contain a username generated by the bridge. You can use
this username to authenticate against the bridge going forward.

```js
let user = new client.users.User;

// Optionally configure a device type / agent on the user
user.deviceType = 'my_device_type'; // Default is 'huejay'

client.users.create(user)
  .then(user => {
    console.log(`New user created - Username: ${user.username}`);
  })
  .catch(error => {
    if (error instanceof huejay.Error && error.type === 101) {
      return console.log(`Link button not pressed. Try again...`);
    }

    console.log(error.stack);
  });
```

*Note: The bridge does not permit supplying your own username.*

*Note: It is possible to use Huejay to toggle the link button if you are already
authenticated with the bridge. This may save you from walking over to the bridge
to physically press the link button.*

#### client.users.get - Get authenticated user

If the username assigned to the client is legitimate, you can get the details for
this user by calling `client.users.get`.

```js
client.users.get()
  .then(user => {
    console.log(`Username: ${user.username}`);
    console.log(`Device type: ${user.deviceType}`);
    console.log(`Create date: ${user.createDate}`);
    console.log(`Last use date: ${user.lastUseDate}`);
  });
```

#### client.users.getByUsername - Get user by username

Although the bridge does not provide an equivalent API for retrieving a user
by username, Huejay provides a means to do so.

Simply pass in a string containing username to `client.users.getByUsername` to
look up the user.

```js
client.users.getByUsername('usernamehere')
  .then(user => {
    console.log(`Username: ${user.username}`);
  });
  .catch(error => {
    console.log(error.stack);
  });
```

If a user is not found with the provided username, a *huejay.Error* is thrown.

#### client.users.getAll - Get all users

Want to retrieve all users assigned to the bridge? You can use
`client.users.getAll` to do so. This method will return an array of **User**
objects.

```js
client.users.getAll()
  .then(users => {
    for (let user of users) {
      console.log(`Username: ${user.username}`);
    }
  });
```

#### client.users.delete - Delete a user

Deleting users using Huejay is simple. Provide either a username or **User**
object to `client.users.delete` to delete a user.

```js
client.users.delete('usernamehere')
  .then(() => {
    console.log('User was deleted');
  })
  .catch(error => {
    console.log(error.stack);
  });
```

## Examples

Want to see more examples? View them in the [examples](examples) directory included
in this repository.

## Logo

Huejay's initial logo was designed by scorpion6 on Fiverr. Font used is Lato Bold.

## License

This software is licensed under the MIT License. [View the license](LICENSE).

Copyright © 2015 [Michael K. Squires](http://sqmk.com)
