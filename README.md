# RestOracle-Osmosis
Backend oracle that signs the data feed

This serves as the data originator for a zkApp smart contract

# Installation

Software dependencies installation with Ubuntu 22.04

```
sudo apt update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
nvm install node
```
Within the RestOracle-Osmosis folder:
```
npm install
```
# Build 
```
npm run build
```
# Run service
```
sudo iptables -I INPUT -p tcp --dport 9151 -j ACCEPT
npm run server
```