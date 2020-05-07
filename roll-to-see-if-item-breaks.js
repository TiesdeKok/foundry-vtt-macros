/** Macro to roll whether a magic item will break with incremental probability of breaking 
* Macro type: script
* Made by Ties de Kok (github.com/tiesdekok)
* Parts might be copied from the Foundry VTT discord server

STATUS: WIP

------ Instructions --------
1. Modify the paramaters below to your liking  

------ Current Known limitations ---------
* You'll probably have to edit it if you don't use "Dice So Nice!"
* It probably breaks if you don't have the token in the current scene
*/

(async () => {
    var actorThatOwnsItem = 'Hogber';
    var itemName = 'Magic Saddle';
    var startingDifficulty = 0; 
    var difficultySteps = 1;
    var reset = false;
    
    var tmpActor = game.actors.entities.filter(t => t.data.name == actorThatOwnsItem)[0];
    var itemDat = tmpActor.data.items.filter(t => t.name == itemName)[0];
    var itemObj = tmpActor.getOwnedItem(itemDat._id);

    var tokenDat = game.scenes.viewed.data.tokens.filter(t => t.name == 'Hogber')[0];
    var tokenObj = canvas.tokens.get(tokenDat._id);

    if (itemObj.getFlag('core', 'breakChance')  === undefined || reset) {
        await itemObj.setFlag('core', 'breakChance', startingDifficulty);
    }

    var breakChance = itemObj.getFlag('core', 'breakChance');

    var r = new Roll('1d20');
    r.roll();
    var breaks = parseInt(r.result) < breakChance;
    var breakPerc = Math.ceil(breakChance / 20 * 100)

    if (breaks) {
        var breakMsg = `Oh no, the ${itemName} broke!`; 
        var breakClr = 'darkred';
    } else {
        var breakMsg = `Awesome, ${itemName} didn't break! <br> Next time you will need to beat: ${breakChance + difficultySteps}`; 
        var breakClr = 'darkGreen';
    }

    var msgToSend = `<header class="card-header flexrow">
        <img src="${itemDat.img}" title="${itemName}" width="36" height="36" style='max-width: 36px; margin-right: 10px;'>
        <h3 class="item-name" style='margin-top: 8px;'><b>${itemName}</b></h3>
    </header>

    <div class="card-content">
        <h3 style='text-align: center; font-weight:bold;'>Will it break?!</h3>
        <p style='text-align:center;'> The ${itemName} has a <b>${breakPerc}%</b> chance to break. It needs to get at least a <b>${breakChance}</b>.</p>

        <div class="dice-roll">
            <div class="dice-result">
                <h4 class="dice-total" style='background-color: ${breakClr}; color: white; padding-top: 5px; padding-bottom: 5px;'>Roll:   ${r.result}</h4>
            </div>
        </div>

        <div>
        <h3 style='text-align: center; font-weight:bold; margin-top:10px;'>${breakMsg}</h3>
        </div
`

    game.dice3d.showForRoll(r).then(displayed => {

        
        var speaker_obj = {
            scene: game.scenes.viewed.data._id,
            actor: tokenObj.actorId,
            token: tokenObj._id,
            alias: tokenObj.name
        };
        
        ChatMessage.create({
            content: msgToSend,
            type: 1,
            speaker: speaker_obj,
        }, {
            chatBubble: false
        })


     });
     await itemObj.setFlag('core', 'breakChance', breakChance + difficultySteps);
     console.log(itemObj.getFlag('core', 'breakChance'))

})()

/* RANDOM DEBUG NOTES (Don't include in macro)
var hogberActor = game.actors.entities.filter(t => t.data.name == 'Hogber')[0];
var itemDat = hogberActor.data.items.filter(t => t.name == 'Magic Saddle')[0];
itemDat.data.price = 2;
hogberActor.updateOwnedItem(itemDat)
var itemObj = hogberActor.getOwnedItem(itemDat._id);

"WvTi3kE8NNdKuD8Q"

Set a flag:
itemObj.setFlag('core', 'test', true)

Remove a flag
itemObj.unsetFlag('core', 'test')

Get flag

itemObj.getFlag('core', 'test')
*/