/**  Macro to select the adventure party 
* Macro type: script
* Made by Ties de Kok (github.com/tiesdekok)
* Parts might be copied from the Foundry VTT discord server

------ Instructions --------
1. In the <Actors Directory> tab create a folder called "CurrentParty"
2. Create as many subfolders as you'd like
3. Drag all actors into an appropriate subfolder 


------ Current Known limitations ---------
* Any actors not in a subfolder are not currently included 
*/

(async () => {
    const partyFolder = 'CurrentParty'
    var CP_folder = game.folders.filter(t => (t.data.name == partyFolder))[0];
    let subFolderEles = "";
    var subFolders = CP_folder.children;
    subFolders.forEach(t => {
        subFolderEles = subFolderEles.concat(`<p><label><input type="checkbox" id="${t.data._id}" value="${t.data.name}" style="height:12px !important; margin-right:10px;"></input>${t.data.name}</label></p>`)
    });

    //const selectHeight = 17 * subFolders.length;
    let template = `
                    <form>
                        <div class="form-group">
                            <label>Select members to move</label>
                            <ul id="memberSelect" style="margin-top:-3px; margin-bottom: 0px;">${subFolderEles}</ul>
                        </div>
                    </form>`

    function selectTokens (mberList) {
        var logNoTokens = true;
        if (canvas.tokens.placeables.length) {
            var tokenArray = mberList.map(tm => canvas.tokens.placeables.find(t => t.data.actorId === tm._id))
            tokenArray = tokenArray.filter(t => t != undefined);
            if (tokenArray.length) {
                var tokensInScene = game.scenes.viewed.data.tokens.map(t => t._id);
                var tokenAvail = tokenArray.filter(i => tokensInScene.includes(i.data._id));
                if (tokenAvail.length > 0) {
                    logNoTokens = false;
                    // Release any selected tokens
                    tokenAvail[0].layer.releaseAll();
                    
                    tokenAvail.forEach(t => {
                        t.control({releaseOthers:false})
                    })
                } else {}
            }
        }
        if (logNoTokens) {
            ui.notifications.warn('None of the tokens are currently in the scene!')
        }
    }

    let buttons = {}
    if (CP_folder && subFolders.length > 0) {
        buttons = {
            select: {
                icon: '<i class="fas fa-check"></i>',
                label: "Select Subset",
                callback: async (html) => {
                    var idSelector = function() { return this.id; };
                    var checked = html.find('#memberSelect input:checked');
                    var foldersToMove;
                    if (checked.length == 1) {
                        foldersToMove = Array(checked.attr('id'));
                    } else if (checked.length > 1) {
                        foldersToMove = checked.map(idSelector).get();
                    } else {
                        foldersToMove = [];
                    }

                    let mberList = [];
                    foldersToMove.forEach(t => {
                        game.folders.get(t).content.forEach(t => {mberList.push(t.data)})
                    });
                    if (mberList.length) {
                        selectTokens(mberList);
                    } else {
                        ui.notifications.warn('You did not select any folders!')
                    }
                }
            },
            selectAll: {
                icon: '<i class="fas fa-check"></i>',
                label: 'Select All',
                callback: async (html) => {
                    const foldersToMove = subFolders.map(t => t.data._id)
                    let mberList = [];
                    foldersToMove.forEach(t => {
                        game.folders.get(t).content.forEach(t => {mberList.push(t.data)})
                    });
                    selectTokens(mberList);
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: 'Cancel'
            }
        }
    } else {
        template = '<div style="text-align: center">There are no tokens to select!</div><br>'
        buttons = {
            move: {
                icon: '<i class="fas fa-check"></i>',
                label: "OK",
            }
        }
    }

    new Dialog({
        title: 'Select Adventure Party',
        content: template, buttons: buttons, default: "Select",
    }).render(true);
})()