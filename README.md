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

### Run
**Note:** If you're running this on macOS, you'll need to run the following with `sudo` for access to Ports 80 and 443.

```bash
node index
```

If you wish to run Sherlock2 under Production, you can start it under pm2 by using

```bash
pm2 start index.js --name "sherlock2" -- --color
```
