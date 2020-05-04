/**  Macro to make all non-player tokens clap via an emote chat bubble
* Macro type: script
* Made by Ties de Kok (github.com/tiesdekok)
* Parts might be copied from the Foundry VTT discord server

------ Instructions --------
1. Modify the paramaters below to your liking  

------ Current Known limitations ---------
* Pets and NPCs are included in the non-player tokens group
*/

(async () => {
    var bubblyOnly = true;
    var includePlayers = false;
    var clapOptions = ['*claps*', '*slow claps*'];
    var probArray = [false, true, true];

    var playerChar = await game.users.players.map(t => (t.data.character));
    var allToken = await game.scenes.viewed.data.tokens;
    if (!includePlayers) {
        var tokenPool = await allToken.filter(i => !playerChar.includes(i.actorId));
    } else {
        var tokenPool = allToken;
    }

    if (tokenPool.length > 0) {
        tokenPool.forEach(t => {
            var speaker_obj = {
                scene: game.scenes.viewed.data._id,
                actor: t.actorId,
                token: t._id,
                alias: t.name
            };
        
            var msg_to_send = clapOptions[Math.floor(Math.random()*clapOptions.length)];

            var sayBoolean = probArray[Math.floor(Math.random()*probArray.length)];
            if (sayBoolean) {
                if (bubblyOnly) {
                    var token = canvas.tokens.get(speaker_obj.token);
                    canvas.hud.bubbles.say(token, msg_to_send, {
                        emote: true
                    })
                } else {
                    ChatMessage.create({
                        content: msg_to_send,
                        type: 2,
                        speaker: speaker_obj,
                    }, {
                        chatBubble: true
                    })
                }
            }
        })
    }
})()