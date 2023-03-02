![Blackhole](src/public/blackhole.jpg)

# Blackhole

Blackhole is a DNS server running on your local machine that sucks up all your ads flowing through your network

## Todo

[✅] **Add a way to view live DNS queries**

[✅] **Add a way to allow blocking ads seperately and from a list**

[❌] **Add login page**

[❌] **Make dashboard look much nicer**

[❌] **Implement features from** [pi-hole](https://github.com/pi-hole/pi-hole)

## Installation

### Setting up
```
git clone https://github.com/r-rajaneesh/blackhole.git Blackhole

cd Blackhole

install.bat
```

## Running the server

```
npm run start
```

## Author

[Rajaneesh R](https://r-rajaneesh.vercel.app)



# Blackhole

Blackhole is a lightweight DNS ad-blocker that blocks all ads running through the network. It is a powerful tool for users who want to improve their web browsing experience and protect their privacy by blocking annoying ads and tracking scripts.

# Features

* Blocks nearly 1 million ad domains
* Runs a DNS server connected with the Operating system on 127.0.0.1
* Lightweight and fast
* Written in Node.js and Typescript

# How it Works

Blackhole runs a DNS server on your local machine that blocks all requests to known ad domains by resolving them to the localhost (127.0.0.1). This means that when your computer tries to connect to an ad domain, Blackhole will intercept the request and return a null response, effectively blocking the ad from being displayed or loaded.

# Installation

To install Blackhole, simply clone the repository and install the necessary dependencies:

```
$ git clone https://github.com/r-rajaneesh/blackhole.git
$ cd blackhole
$ npm install
```

Once installed, you can start the Blackhole DNS server by running the following command:

```
$ npm start
```

This will start the DNS server on your local machine, listening on port 53. You can configure your Operating system to use this DNS server by setting the DNS server address to 127.0.0.1.

# Alternatives
Blackhole is a great alternative to other popular ad-blocking solutions like Pi-hole. While Pi-hole is a great tool, it can be more complicated to set up and maintain, especially for less technical users. Blackhole is designed to be simple, fast, and lightweight, making it a great choice for anyone who wants to block ads without a lot of hassle.

# License
Blackhole is licensed under the GPL-3.0 License.

# Contributing
We welcome contributions from anyone who is interested in helping improve Blackhole. To contribute, simply fork the repository, make your changes, and submit a pull request. We appreciate your help and feedback!

# Credits
Blackhole was created by [Rajaneesh R](https://r-rajaneesh.vercel.app).
