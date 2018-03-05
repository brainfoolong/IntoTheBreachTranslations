![1.0.10 (2-28-2018)](https://img.shields.io/badge/Game_Version-1.0.10(2--28--2018)-green.svg) 
![1.0.10 (2-28-2018)](https://img.shields.io/badge/DE-2%25-orange.svg)
# Into the Breach - Translations
Inofficial Translations for PC Game Into the Breach. This is all fan made. You can help translating this game into your language. If used, it does directly modify some game files.

Not final yet, working on it. You can help.

# How to install
1. Download a language pack from our releases
2. Find your game folder
2. Find the folder `scripts`
4. Unpack all files in the `scripts` folder. WARNING: You must replace existing files, better make a backup before doing this because it does modify the original game files.

# How to contribute

1. Clone
2. Open your target language file from `languages/xx.po` with PoEdit (https://poedit.net/)
3. Modify with PoEdit
4. Push changes via Pull Request to this repository

# How to create a new language base

1. Create an issue request
2. Additionaly: Open `languages/template.pot` with PoEdit and create your new language `.po` file in this directory

# How to test your translation
1. Do everything from "contribute"
2. Run `npm install` in the base directory of this repository
3. Copy `dev/config.tpl.js` to `dev/config.js` and modify the config to your needs
4. Run `dev/create-language-packages.js` via NodeJS
5. Search the generated zipfile for your language in `dev/packages` and follow the `installation` routine

# Limitations
* No cyrillic support


