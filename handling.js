//Stores commonly used methods for math and other functions
//AUTHOR: Harley Welsby

import { alcohol_cfg, mixer_cfg, min_parts, max_parts } from './config.js';

//Get a number within a list range
export function randroll(list) {
    return Math.floor(Math.random()*list.length);
}

//Roll which ingredient to add next
export function rollDrink(alc) {
    return alc ? alcohol_cfg()[randroll(alcohol_cfg())] : mixer_cfg()[randroll(mixer_cfg())];
}

//Roll a cursed drink (much more random)
export function rollCursed(custom) {
    var random = Math.floor(Math.random()*3);
    if(random == 0) {
        return alcohol_cfg()[randroll(alcohol_cfg())];
    }
    else if(random == 1) {
        return mixer_cfg()[randroll(mixer_cfg())];
    }
    else {
        return custom[randroll(custom)];
    }
}

export function rollNye(custom) {
    return custom[randroll(custom)];
}

//Get number of shots
export function getShots() {
    return min_parts() + (Math.random() * max_parts());
}