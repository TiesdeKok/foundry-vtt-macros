/**  Quick and dirty import Macro to create scenes with list of images/videos
* Macro type: script
* Made by Ties de Kok (github.com/tiesdekok)
* Parts might be copied from the Foundry VTT discord server

------ Instructions --------
1. @param backgroundsToImport is an Array with filenames referring to images/videos
2. @param parentFolderName is the name of the folder in the FVTT Scenes tab
3. @param localFolder is the filesystem folder inside you FVTT storage > data where you videos/images are stored
4. Modify line 38 and change .mp4 to whatever you filetype is


------ Current Known limitations ---------
* Many, this will break in many cases but it is only supposed to be ran a couple times to auto-generate scenes once you find a bunch of new backgrounds.
*/

(async () => {

var backgroundsToImport = ['ABANDONED CAVERN - GRID.mp4', 'ADMaps_DUNGEON SLAVE MARKET.mp4', 'ADMaps_TWISTED CAVES - GRID.mp4'];
var parentFolderName = 'Animated maps - unused'
var localFolder = 'animated_maps'

async function createSceneCustom (imgName) {
    var parentFolder = game.folders.filter(t => (t.data.name == parentFolderName))[0];
    var imgPath = localFolder + "/" + imgName + ".mp4";
    
    var createData = {name: imgName, 
                      navigation: false, 
                      folder: parentFolder.data._id,
                      img: imgPath};
    var createdScene = await Scene.create(createData)
    BackgroundLayer.createThumbnail(createdScene.data.img).then(data => {
        createdScene.update({thumb: data.thumb});
      });  
}

backgroundsToImport.forEach(imgName => {
    createSceneCustom(imgName.replace('.mp4', '')
    )
})

})()

