# Microsoft icon set for plantuml

> This has been deprecated in favor of [Azure-PlantUML by RicardoNiepel](https://github.com/RicardoNiepel/Azure-PlantUML/)
> which is now [PlantUml stdlib](https://github.com/plantuml-stdlib/Azure-PlantUML)

Inspired by [plantuml-icon-font-sprites](https://github.com/tupadr3/plantuml-icon-font-sprites), I donwloaded [Microsoft icon set](http://aka.ms/CnESymbols), extracted and made ``.puml`` files.

Furthermore I have included the [new Office 2019 Icons from this medium article](https://medium.com/jumpto365/need-large-transparent-png-versions-of-the-new-office-365-icons-here-you-go-997c58d32675)

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
