//Stores tweakable values for bot functions
//AUTHOR: Harley Welsby

//Bot login token
export function token() {
    return token = 'Put your bot token here!';
}

//Minimum number of alcoholic ingredients
export function min_alcoholic() {
    return 1;
}

//Maximum number of alcoholic ingredients
export function max_alcoholic() {
    return 3;
}

//Minimum number of mixers
export function min_mixer() {
    return 1;
}

//Maximum number of mixers
export function max_mixer() {
    return 3;
}

//Minimum number of parts
export function min_parts() {
    return 1;
}

//Maximum number of parts
export function max_parts() {
    return 4;
}

//List of possible spirits
export function alcohol_cfg() {
    return ['Put your ingredients here! (eg. Vodka)'];
}

//List of possible mixers
export function mixer_cfg() {
    return ['Put your ingredients here! (eg. Pineapple Juice)'];
}

//List of possible taglines, ie "This drink is served on the rocks"
export function served_cfg() {
    return ['Put your serving instructions here (eg. Garnish with a lemon wedge)!'];
}

//List of words to combine into a cool name
export function name_cfg() {
    return ['Put some words here to craft cool drink names (eg. "Funky","Mojito")'];
}