![Blackhole](tmp/blackhole.png)

# Blackhole

Blackhole is a lightweight DNS ad-blocker that blocks all ads running through the network. It is a powerful tool for users who want to improve their web browsing experience and protect their privacy by blocking annoying ads and tracking scripts.

# Features

- Blocks nearly 1 million ad domains
- Runs a DNS server connected with the Operating system on 127.0.0.1
- Lightweight and fast
- Written in Node.js and Typescript

# How it Works

Blackhole runs a DNS server on your local machine that blocks all requests to known ad domains by resolving them to the localhost (127.0.0.1). This means that when your computer tries to connect to an ad domain, Blackhole will intercept the request and return a null response, effectively blocking the ad from being displayed or loaded.

## Todo

[✅] **Add a way to view live DNS queries**

[✅] **Add a way to allow blocking ads seperately and from a list**

[❌] **Add login page**

[❌] **Make dashboard look much nicer**

[❌] **Implement features from** [pi-hole](https://github.com/pi-hole/pi-hole)

# Installation

To install Blackhole, simply clone the repository and install the necessary dependencies:

```
git clone https://github.com/r-rajaneesh/blackhole.git blackhole

cd blackhole

npm install

npm run build
```

Once installed, you can start the Blackhole DNS server by running the following command:

```
npm run start
```

This will start the DNS server on your local machine, listening on port 53. You can configure your Operating system to use this DNS server by setting the DNS server address to 127.0.0.1.

# Known Errors

DNS UDP Port Error

![dns udp port error](/tmp/dns_udp_port_error.png)

This is the most common error you might face on a windows system, you get this error because windows already runs tasks on the UDP port 53 for ICS. Since the port is being used blackhole cannot use the port for the DNS server

Why port 53?

Port 53 is the most commonly used and is the default port for all DNS servers

How to resolve this issue

<iframe width="560" height="315" src="https://www.youtube.com/embed/a3bVNSFYy5o" title="🌀 Blackhole | Bug Fix | LOCAL DNS AD BLOCKING SERVER | Github" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

# Alternatives

Blackhole is a great alternative to other popular ad-blocking solutions like Pi-hole. While Pi-hole is a great tool, it can be more complicated to set up and maintain, especially for less technical users. Blackhole is designed to be simple, fast, and lightweight, making it a great choice for anyone who wants to block ads without a lot of hassle.

# License

Blackhole is licensed under the GPL-3.0 License.

# Contributing

We welcome contributions from anyone who is interested in helping improve Blackhole. To contribute, simply fork the repository, make your changes, and submit a pull request. We appreciate your help and feedback!

# Credits

Blackhole was created by [Rajaneesh R](https://r-rajaneesh.vercel.app).
