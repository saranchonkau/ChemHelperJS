## How to install `sqlite3` module

1. Install `windows-build-tools`. Visual studio 2015 (!)

```
npm install --global windows-build-tools --vs2015
```

### First way

2. install `electron-builder`

```
npm install electron-builder
```

3. add the following script in `package.json`

```
"postinstall": "electron-builder install-app-deps"
```

4. install dependencies

### Second way

2. install `electron-rebuild`
3. run command

```
electron-rebuild -f -w sqlite3
```
