![Blackhole](/public/blackhole.jpg)

# Blackhole

Blackhole is a DNS server running on your local machine that sucks up all your ads flowing through your network

## Todo

[✅] **Add a way to view live DNS queries**

[❌] **Add a way to allow blocking ads seperately and from a list**

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

### In Development
```
npm run start
```

### In Production
```js
// server.ts

// Comment line 20 and uncomment line 21

/* LINE 20 */
const dev = process.env.NODE_ENV !== "production";

/* LINE 21 */
const dev = false;
```
```
npm run start
```


## Author

[Rajaneesh R](https://r-rajaneesh.vercel.app)

