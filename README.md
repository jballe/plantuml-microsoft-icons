# Microsoft icon set for plantuml

Inspired by [plantuml-icon-font-sprites](https://github.com/tupadr3/plantuml-icon-font-sprites)
but created with the [Microsoft icon set](http://aka.ms/CnESymbols)

## How to use

```
!define MS_SPRITESPATH https://raw.githubusercontent.com/jballe/plantuml-microsoft-icons/master/sprites
!includeurl MS_SPRITESPATH/Enterprise/Web_server.puml
```

For each icon there is defined variables for two images, a grey scale and a color version, but resized to 48x48 pixels.

```
database "Active directory in gray \n MSIMG_AZUREACTIVEDIRECTORY_G" as ad
database "Active directory in color \n MSIMG_AZUREACTIVEDIRECTORY_C" as ad
```

There is also defined a plantuml native sprite based on the grayscale image, but I don't think I have had much luck with those.

However you can use it like this:

```
component "<$azureactivedirectory>"
```
