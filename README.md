# detect-reserved-keywords
Simple tool to detect reserved words used as object properties in a javascript file


# To install

```npm install detect-reserved-keywords -g```

# Options

type ```dresv -h```

    -h, --help             output usage information
    -V, --version          output the version number
    -e, --es <version>     Ecmascript dialects version either: 3, 5 or 6
    -f, --file <file.js>   javascript file reference, ie: -f jsFileWithReserveWords.js
    -d, --dir <directory>  parse all *.js files in a directory

# To use the cli
type in your console

```dresv -e 3 -f file.js```

to parse all files in current directory

```dresv -e 3 -d *```

to parse all files in a directory

```dresv -e 3 -d ./somedir/js```
