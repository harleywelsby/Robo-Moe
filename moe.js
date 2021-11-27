// =============================================================
// || Moe the Bartender - Random Cocktail Discord Bot         ||
// =============================================================
// || AUTHOR: Harley Welsby, https://github.com/harleywelsby  ||
// =============================================================

import { Client, Intents, Message } from 'discord.js';

//IMPORTANT VARIABLES
var min_ingredients = 2;
var max_ingredients = 5;
var min_alc_ingredients = 1;
var max_alc_ingredients = 3;
var min_parts = 1;
var max_parts = 4;

//Clear these
var alc_ingredients = [];
var nonalc_ingredients = [];

//DATA
var alcohol = ['vodka','dark rum','white rum','malibu','tequila','bourbon','jack daniels','whisky','peach schnapps','apple sourz'];
var mixers = ['cranberry juice','pineapple juice','apple juice','orange juice','bitters','lime juice','lemon juice'];
var served = ['served on the rocks','served neat','shaken, not stirred','on fire.','screaming','banned in 15 states','sentient'];

var custom = [];

var names = ['Ancient', 'Mariner','Bacardi','Between', 'the', 'Sheets','Blow', 'Skull', 'Off','Blue', 'Hawaii','Brass', 'Monkey',
             'Bumbo','Bushwacker','Caribou', 'Lou','Cobras', 'Fang','Cojito','Cremat','Cuba', 'Libre','Cuban', 'Sunset','Daiquiri',
             'Dark', 'Stormy','El', 'Presidente','Fish', 'House', 'Punch','Flaming', 'Doctor', 'Pepper','Flaming', 'volcano','Fluffy', 
             'Critter','Fluffy', 'duck','Grog','Gunfire','Hoppel', 'poppel','Hot', 'buttered', 'rum','Hurricane','Jagertee','Long', 
             'Island', 'Iced', 'Tea','Macua','Mai', 'Tai','Mojito','Mr', 'Bali', 'Hai','Painkiller','Pina', 'colada','Planters', 
             'Punch','QB', 'Cooler','Royal', 'Bermuda', 'Cocktail','Rum', 'Swizzle','Suffering', 'Bastard','Sumatra', 'Kula','Test', 
             'Pilot','Ti', 'Punch','Tom', 'and', 'Jerry','Tschunk','Yellow', 'Bird','Zombie','Undefined'];


//INITIALIZATIONS
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Login
bot.on('ready', () => {
    console.log('logged in!');
    bot.user.setActivity('you get drunk', { type: 'WATCHING' });
});

function rollDrink(alc) {
    return alc ? alcohol[Math.floor(Math.random()*alcohol.length)] : mixers[Math.floor(Math.random()*(alcohol.length-1))];
}

function rollCursed() {
    var random = Math.floor(Math.random()*3);
    if(random == 0) {
        return alcohol[Math.floor(Math.random()*alcohol.length)]
    }
    else if(random == 1) {
        return mixers[Math.floor(Math.random()*mixers.length)]
    }
    else {
        return custom[Math.floor(Math.random()*custom.length)]
    }
}

function getShots() {
    return min_parts + (Math.random() * max_parts);
}

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
        if (nonalc_ingredients.includes(drink)) {
            recursiveDrinkCheck(false);
        }
        else {
            nonalc_ingredients.push(drink);
        }
    }
}

function recursedCheck() {
    var drink = rollCursed();
    if (alc_ingredients.includes(drink)) {
        recursedCheck();
    }
    else {
        alc_ingredients.push(drink);
    }
}

//Make a drink
bot.on('messageCreate', msg => {
    if (msg.content.startsWith('!drink')) {
        
        var num_alc_ingredients = Math.floor( min_alc_ingredients + ( Math.random() * max_alc_ingredients ) );
        var num_ingredients = Math.floor( min_ingredients + ( Math.random() * max_ingredients ) );
        var howmany = 0;
        //var alc_ingredients = [];
        //var nonalc_ingredients = [];

        for(howmany = 0; howmany<num_alc_ingredients; howmany++) {
            recursiveDrinkCheck(true);
        }
        for(howmany = howmany; howmany<num_ingredients; howmany++) {
            recursiveDrinkCheck(false);
        }

        var output = 'This one\'s called the \" ';

        //Do name
        var num_words = Math.floor(1+Math.random()*3);
        for(let i=0; i<num_words; i++) {
            output += names[Math.floor(Math.random()*names.length)];
            output += ' ';
        }
        output += '\"!\n\n';
        
        //Do drink
        for(let i=0; i<alc_ingredients.length; i++) {
            output += Math.floor(getShots()) + ' parts ' + alc_ingredients[i] + '\n';
        }
        for(let i=0; i<nonalc_ingredients.length; i++) {
            output += Math.floor(getShots()) + ' parts ' + nonalc_ingredients[i] + '\n';
        }

        var how_served = Math.floor(Math.random()*4);
        if(how_served < 2) {
            output += '\nThis drink is ' + served[Math.floor(Math.random()*served.length)] + '\n';
        }

        msg.reply(output);

        alc_ingredients = [];
        nonalc_ingredients = [];
    }

    else if(msg.content.startsWith('!cursed')) {
        var num_ingredients = Math.floor( min_ingredients + ( Math.random() * max_ingredients ) );

        for(let i=0; i<num_ingredients; i++) {
            recursedCheck();
        }

        var output = 'This one\'s called the \" ';

        //Do name
        var num_words = Math.floor(1+Math.random()*3);
        for(let i=0; i<num_words; i++) {
            output += names[Math.floor(Math.random()*names.length)];
            output += ' ';
        }
        output += '\"!\n\n';
        
        //Do drink
        for(let i=0; i<alc_ingredients.length; i++) {
            output += Math.floor(getShots()) + ' parts ' + alc_ingredients[i] + '\n';
        }

        var how_served = Math.floor(Math.random()*4);
        if(how_served < 2) {
            output += '\nThis drink is ' + served[Math.floor(Math.random()*served.length)] + '\n';
        }

        msg.reply(output);

        alc_ingredients = [];
        nonalc_ingredients = [];
    }

    else if(msg.content.startsWith('!add')) {
        custom.push(msg.content.split(' ')[1]);
        msg.reply('Added \"' + msg.content.split(' ')[1] + '\" successfully');
    }

    else if(msg.content.startsWith('!custom')) {
        var output = 'The custom ingredients are: \n\n';
        for(let i=0; i<custom.length-1; i++) {
            output += custom[i] + ', ';
        }
        output += 'and ' + custom[custom.length-1] + '!';
        msg.reply(output);
    }
});

bot.login(config.token);