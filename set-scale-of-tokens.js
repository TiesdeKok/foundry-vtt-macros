/**  Macro to set the scale of the tokens
* Macro type: script
* Made by Ties de Kok (github.com/tiesdekok)
* Parts might be copied from the Foundry VTT discord server

------ Instructions --------
1. Modify the paramaters below to your liking  

------ Current Known limitations ---------
*/

(async () => {
    var desiredScale = {
        'Elwarith': 1.6,
        'Tristan' : 1.5,
        'Henrik' : 0.8,
        'Arkvenom' : 1,
        'Smash' : 0.8,
        'Hogber' : 1.5,
        'Bertus' : 0.9,
        'Copper Nikus' : 0.8,
        'Elios Qikas' : 0.8
    };

    var allToken = game.scenes.viewed.data.tokens;
    var arrayOfUpdates = [];
    if (allToken.length > 0) {
        allToken.forEach(t => {
            var tokenName = t.name
            if (tokenName in desiredScale) {
                arrayOfUpdates.push({_id: t._id, 
                                    scale: desiredScale[tokenName], 
                                    width: 1, 
                                    height: 1})
            }
        })
    }
    if (arrayOfUpdates.length > 0) {
        canvas.tokens.updateMany(arrayOfUpdates);
    }
})()

/* RANDOM DEBUG NOTES (Don't include in macro)
canvas.tokens.updateMany(arrayOfUpdates);

var tokenObj = canvas.tokens.get(t._id)
tokenObj.data.scale = desiredScale[tokenName];
tokenObj.data.width = 1;
tokenObj.data.height = 1;
arrayOfUpdates.push(arrayOfUpdates)
var allToken = game.scenes.viewed.data.tokens;
var tmpToken = allToken[0]
var tmpTokenObj = canvas.tokens.get(tmpToken._id);
tokenObj.update({scale: desiredScale[tokenName], width: 1, height: 1})

tmpTokenObj.data.scale
*/
