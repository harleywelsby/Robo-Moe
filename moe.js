// =============================================================
// || Moe the Bartender - Random Cocktail Discord Bot         ||
// =============================================================
// || AUTHOR: Harley Welsby, https://github.com/harleywelsby  ||
// =============================================================

import { Client, Intents, Message } from 'discord.js';
import { token, served_cfg, name_cfg, min_alcoholic, max_alcoholic, min_mixer, max_mixer } from './config.js';
import { randroll, rollDrink, rollCursed, getShots, rollNye } from './handling.js';

//Lists to hold currently used ingredients
var alc_ingredients = [];
var mix_ingredients = [];
var custom = [];

//INITIALIZATIONS
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Login
bot.on('ready', () => {
    console.log('logged in!');
    bot.user.setActivity('you get drunk', { type: 'WATCHING' });
});

//Recursive method to stop duplicate ingredients
function recursiveDrinkCheck(alc) {
    var drink = rollDrink(alc);
    if(alc) {
        if (alc_ingredients.includes(drink)) {
            recursiveDrinkCheck(true);
        }
        else {
            alc_ingredients.push(drink);
        }
    }
    else {
        if (mix_ingredients.includes(drink)) {
            recursiveDrinkCheck(false);
        }
        else {
            mix_ingredients.push(drink);
        }
    }
}

//Simple recursive method to stop duplicate ingredients
function recursedCheck() {
    var drink = rollCursed(custom);
    if (alc_ingredients.includes(drink)) {
        recursedCheck();
    }
    else {
        alc_ingredients.push(drink);
    }
}

function recursiveNyeRoll() {
    var drink = rollNye(custom);
    if (alc_ingredients.includes(drink)) {
        recursiveNyeRoll();
    }
    else {
        alc_ingredients.push(drink);
    }
}

//Make a drink
function drink(msg) {
    //Roll number of ingredients
    var num_alc = Math.floor( min_alcoholic() + ( Math.random() * max_alcoholic() ) );
    var num_mixer = Math.floor( min_mixer() + ( Math.random() * max_mixer() ) );
    var howmany = 0;

    //Do alcoholic ingredients, then the rest
    for(howmany = 0; howmany < num_alc; howmany++) {
        recursiveDrinkCheck(true);
    }
    for(howmany = howmany; howmany < num_mixer; howmany++) {
        recursiveDrinkCheck(false);
    }

    //Construct message
    var output = 'This one\'s called the \" ';

    //Do name
    var num_words = Math.floor(1 + Math.random()*3);
    for(let i=0; i<num_words; i++) {
        output += name_cfg()[randroll(name_cfg())];
        output += ' ';
    }
    output += '\"!\n\n';

    //Do drink
    for(let i=0; i < alc_ingredients.length; i++) {
        output += Math.floor(getShots()) + ' parts ' + alc_ingredients[i] + '\n';
    }
    for(let i=0; i < mix_ingredients.length; i++) {
        output += Math.floor(getShots()) + ' parts ' + mix_ingredients[i] + '\n';
    }

    //Add an optional garnish / presentation instruction
    var how_served = Math.floor(Math.random()*4);
    if(how_served < 2) {
        output += '\nThis drink is ' + served_cfg()[randroll(served_cfg())] + '\n';
    }

    //Send the message
    msg.reply(output);

    //Reset lists
    alc_ingredients = [];
    mix_ingredients = [];
}

function nye(msg) {
    //Calc number of ingredients
    var num_ingredients = Math.floor((min_mixer() + (Math.random() * (max_mixer() + max_alcoholic()))));

    //Error handling
    if (custom.length == 0) {
        msg.reply('You need to add ingredients first!');
        return;
    }
    else if (num_ingredients > custom.length) {
        num_ingredients = custom.length;
    }

    //Roll ingredients avoiding duplicates
    for(let i=0; i<num_ingredients; i++) {
        recursiveNyeRoll();
    }

    //Construct message
    var output = 'This one\'s called the \" ';

    //Do name
    var num_words = Math.floor(1 + Math.random()*3);
    for(let i=0; i<num_words; i++) {
        output += name_cfg()[randroll(name_cfg())];
        output += ' ';
    }
    output += '\"!\n\n';
    
    //Do drink
    for(let i=0; i<alc_ingredients.length; i++) {
        output += Math.floor(getShots()) + ' parts ' + alc_ingredients[i] + '\n';
    }

    //Add an optional garnish / presentation instruction
    var how_served = Math.floor(Math.random()*4);
    if(how_served < 2) {
        output += '\nThis drink is ' + served_cfg()[randroll(served_cfg())] + '\n';
    }

    msg.reply(output);
    alc_ingredients = [];
}

function cursed(msg) {
    //Calc number of ingredients
    var num_ingredients = Math.floor((min_mixer() + (Math.random() * (max_mixer() + max_alcoholic()))));

    //Roll ingredients avoiding duplicates
    for(let i=0; i<num_ingredients; i++) {
        recursedCheck();
    }

    //Construct message
    var output = 'This one\'s called the \" ';

    //Do name
    var num_words = Math.floor(1 + Math.random()*3);
    for(let i=0; i<num_words; i++) {
        output += name_cfg()[randroll(name_cfg())];
        output += ' ';
    }
    output += '\"!\n\n';
    
    //Do drink
    for(let i=0; i<alc_ingredients.length; i++) {
        output += Math.floor(getShots()) + ' parts ' + alc_ingredients[i] + '\n';
    }

    //Add an optional garnish / presentation instruction
    var how_served = Math.floor(Math.random()*4);
    if(how_served < 2) {
        output += '\nThis drink is ' + served_cfg()[randroll(served_cfg())] + '\n';
    }

    msg.reply(output);
    alc_ingredients = [];
}

//Make a drink
bot.on('messageCreate', msg => {
    
    //Make a drink
    if (msg.content.startsWith('!drink')) {
        drink(msg);
    }

    //Make a cursed drink (Custom ingredients)
    else if(msg.content.startsWith('!cursed')) {
        cursed(msg);
    }
    
    //Add an ingredient
    else if(msg.content.startsWith('!add')) {
        custom.push(msg.content.split(' ')[1]);
        msg.reply('Added \"' + msg.content.split(' ')[1] + '\" successfully');
    }

    //See the custom list of ingredients
    else if(msg.content.startsWith('!custom')) {
        var output = 'The custom ingredients are: \n\n';
        for(let i=0; i<custom.length-1; i++) {
            output += custom[i] + ', ';
        }
        output += 'and ' + custom[custom.length-1] + '!';
        msg.reply(output);
    }

    else if(msg.content.startsWith('!nye')) {
        nye(msg);
    }

    else if(msg.content.startsWith('!remove')) {
        if (custom.includes(msg.content.split(' ')[1])) {
            var index = custom.indexOf(msg.content.split(' ')[1])
            custom.splice(index, 1);
            msg.reply(msg.content.split(' ')[1] + ' was removed from the ingredients list!');
            return;
        }
        else {
            msg.reply('That item doesn\'t exist!');
            return;
        }
    }

    else if(msg.content.startsWith('!namestorm')) {
        var output = 'Here\'s some cool names for your drink ideas:\n';
        for(let i=0; i<10; i++) {
            //Do name
            var num_words = Math.floor(1 + Math.random()*3);
            output += '\" '
            for(let i=0; i<num_words; i++) {
                output += name_cfg()[randroll(name_cfg())];
                output += ' ';
            }
            output += '\"\n';
        }
        msg.reply(output);
    }

});

bot.login(token());