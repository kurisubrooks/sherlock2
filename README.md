# Sherlock2
Like Sherlock, but not as poorly coded

### Prerequisites
Sherlock2 requires a minimum of Node v7.6  
Please update your Node.js runtime to use Sherlock2.

**macOS**
```bash
brew install pkg-config cairo pango libpng jpeg giflib
```

**Ubuntu**
```bash
sudo apt install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
sudo setcap 'cap_net_bind_service=+ep' `which node`
```

### Installation
```bash
git clone https://github.com/kurisubrooks/sherlock2.git
cd sherlock2/
npm install
```

### Setup
Rename or duplicate `keychain.json.example` in the root directory to `keychain.json` and complete the JSON file by providing your API Keys for the various services listed in the file.

**Note:** `session` in `keychain.json` is not an API Key, and instead is a secure key that is used for checking the validity of client↔server sessions. You can easily generate a key for this by opening the node REPL in your terminal by running `node`, then copy pasting the following code:

```js
crypto.randomBytes(Math.ceil(80 / 2)).toString("ascii")
```

### Run
**Note:** If you're running this on macOS, you'll need to run the following with `sudo` for access to Ports 80 and 443.

```bash
node index
```

If you wish to run Sherlock2 under Production, you can start it under pm2 by using

```bash
pm2 start index.js --name "sherlock2" -- --color
```
