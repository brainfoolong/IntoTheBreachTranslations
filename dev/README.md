# Dev Tools

This are the tools to automatically parse all game files for language keys. To re-integrate the translated languages into game files. To pack it all into a handy `.zip` files. To pack/unpack `resource.dat` for the game fonts and images.

## Resource.dat pack/unpack/modify
The `resource.dat` file contains images and fonts files for the game. Maybe you have to modify it for your language. In preparation you must setup your `/dev/config.js` as described bellow.
* To unpack the resource.dat Goto `/dev` and run `node resource-dat-unpack.js` - It will extract the resource files into `/dev/dat-files-extracted`
* To re-pack the resource.dat Goto `/dev` and run `node resource-dat-pack.js`. The `/dev/dat-files-extracted/*` and `/dev/dat-files-modified/{language}/*` will be merged into `/dev/dat-generated/resource.dat`
  * If you have modified files for the resource.dat, copy it into `/dev/dat-files-modified/{language}`, create the folder if not exist. This will be taken when you run the pack tool.
    
## generate the .zip files and update your game files
Goto `/dev` and run `node update-translation-packs.js`. This will create the .zip files + does copy your target language modifications, that is configured in your `config.js`, into your game files, so you can directly test the translations in game.

## template.json generation
Goto `/dev` and run `node update-translation-template.js`. If you are missing translation keys, you have to modify this file. It's somewhat complicated to understand the logic in there :)

## config.js
Goto `/dev` and copy the `config.tpl.js` to `config.js` and modify it to your needs.

NOTE : On windows, don't use backslahes `\`, use normal slashes `/` for the path. Also don't forget the drive letter at beginning, like `c:/`

* `gamedir` is the original game folder, where the tools write the files into, when configured. 
* `gamesrc` means that this should be a copied folder of the original game folder (unmodified), it will be took as source for modifications.
* `langInGameDir` is the target language that you modify, it's required for the tools to decide what language it should write into your game files
* `editorPort` If you use the `editor` to translate
* `editorLanguage` If you use the `editor` to translate
