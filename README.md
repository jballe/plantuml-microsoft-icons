# Microsoft icon set for plantuml

Inspired by [plantuml-icon-font-sprites](https://github.com/tupadr3/plantuml-icon-font-sprites), I donwloaded [Microsoft icon set](http://aka.ms/CnESymbols), extracted and made ``.puml`` files.

Both resized images and sprites are available.

See the [samples](samples/README.md)

## How to use

```
!define MS_SPRITESPATH https://raw.githubusercontent.com/jballe/plantuml-microsoft-icons/master/sprites
!includeurl MS_SPRITESPATH/Enterprise/Web_server.puml
```

For each icon there is defined variables for three images, a greyscale, a color and a black and white version, all resized to 48x48 pixels.

```
database "Active directory in black and white \n MSIMG_AZUREACTIVEDIRECTORY_B" as ad
database "Active directory in color \n MSIMG_AZUREACTIVEDIRECTORY_C" as ad
database "Active directory in gray \n MSIMG_AZUREACTIVEDIRECTORY_G" as ad
```

There is also defined a plantuml native sprite based on the black and white image.

```
component "<$azureactivedirectory>"
```
