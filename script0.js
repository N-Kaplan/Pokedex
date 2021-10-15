//todo: limit input to existing pokemons?
//todo: make it possible to see > 4 abilities / randomize abilities
//todo: is an action necessary if no previous evolution exists?
//todo: get_chain - test
//todo: finish get future evolution function

// end asyncs in at least 1 .then: e.g.
// fetchData(url_p).then(data => console.log(data));

const fetchData = async (url) => {
    try {
        let data = await fetch(url);
        let parsedData = await data.json();
        //console.log(parsedData);
        return parsedData;
    }
    catch (error) {
        console.error(error);
        console.log('No Pokemon found. Try a lower number or a different spelling')
    }
}

const getImageSrc = (data) => {
    return data['sprites']['front_default'];
}

const displayPokemon = async (url) => {
    let data = await fetchData(url);
    let name = data['name'];
    let id = data['id'];
    let sprite = await getImageSrc(data);
    //let sprite = data['sprites']['front_default'];
    let moves = data['moves'];
    console.log(name);
    console.log(id);
    console.log(sprite);
    //console.log(moves);
    //console.log(moves.length);

    let moves_disp = [];
    if (moves.length < 4) {
        moves_disp = moves;
    } else {
        moves_disp = moves.slice(0,4);
    }
    //console.log(moves_disp);

    for (const mv of moves_disp) {
        //console.log(mv['move']['name']);
    }
}

//check if this works
const get_chain = (arr) => {
    let next_evs = [];
    if (arr['chain']['evolves_to'].length !== 0) {
        for (let ev of arr['chain']['evolves_to']) {
            let arr = [ev['species']['name'] , ev['species']['url']];
            next_evs.push(arr);
        }
        console.log(next_evs);
    }
    return next_evs;
}


const nameImgArr = async (pokemon_name) => {
    const url = baseUrl + '/' + pokemon_name;
    let data = await fetchData(url);
    let image = getImageSrc(data);
    return [pokemon_name, image];
};
/*
const displayFutEvolution = async (url) => {
    let data = await fetchData(url);
    let ev_url = data['evolution_chain']['url'];
    console.log(` evolution chain url: ${ev_url}`);
    let ev_chain = await fetchData(ev_url);
    let first_n = ev_chain['chain']['species']['name'];
    let first = await nameImgArr(first_n);

    console.log(first);
    // from here: control for undefined due to non-existence
    // let second_evs = []
    // if (ev_chain['chain']['evolves_to'].length !== 0) {
    //     for (let ev of ev_chain['chain']['evolves_to']) {
    //         let ev_arr = [ev['species']['name'] , ev['species']['url']];
    //         second_evs.push(ev_arr);
    //     }
    //     console.log(second_evs);
    // };
    // let second = ev_chain['chain']['evolves_to']['0']['species']['name'];
    // let third = ev_chain['chain']['evolves_to']['0']['evolves_to']['0']['species']['name'];
    //console.log(`first species in chain: ${first}`);
    //console.log(`second species in chain: ${second}`);
    //console.log(`third species in chain: ${third}`);
}
*/
// const displayPrevEvolution = async (url) => {
//     let data = await fetchData(url);
//     let prev = data['evolves_from_species'];
//     //continue only if a previous evolution exists
//     if (prev) {
//         let name_prev = prev['name'];
//         //fetch data of prev evolution
//         let url_prev = baseUrl+'/'+name_prev;
//         let data_prev = await fetchData(url_prev);
//         let img_prev = await getImageSrc(data_prev);
//         console.log(`prev image: ${img_prev}`);
//         //get the species url of the previous evolution
//         let url_prev_species = data_prev['species']['url'];
//         console.log(`url_prev_species: ${url_prev_species}`);
//         let earlier_ev = displayPrevEvolution(url_prev_species);
//
//         //return img_prev;
//     } else {
//         return 'no previous evolution';
//     }
//}

const getPrevEvName = async (url) => {
    let data = await fetchData(url);
    let previous = await data['evolution_chain']['evolves_from_species'];
    console.log(`previous ${previous}`)
}

// const displayPrevEvolutionName = async (url) => {
//     let data = await fetchData(url);
//     let prev = data['evolution_chain']['evolves_from_species'];
//     // console.log(`prev ${prev}`);
//     //continue only if a previous evolution exists
//     if (prev !== undefined) {
//         let name_prev = prev['name'];
//         //fetch data of prev evolution
//         let url_prev = baseUrl+'/'+name_prev;
//         let data_prev = await fetchData(url_prev);
//         let url_prev_species = data_prev['species']['url'];
//         //recursive
//          await displayPrevEvolutionName(url_prev_species);
//         //return name_prev;
//     } else {
//         return 'no previous evolution';
//     }
// }
//
// const displayPrevEvolutionImg = async (url) => {
//     let data = await fetchData(url);
//     let prev = data['evolution_chain']['evolves_from_species'];
//     // console.log(`prevImg ${prev}`);
//     // console.log(prev === undefined);
//     // console.log(prev !== undefined);
//     //continue only if a previous evolution exists
//     let evolution_images = [];
//     while (prev !== undefined) {
//         let name_prev = prev['name'];
//         evolution_images.push(name_prev);
//         console.log(evolution_images);
//         //fetch data of prev evolution
//         let url_prev = baseUrl+'/'+name_prev;
//         let data_prev = await fetchData(url_prev);
//         let img_prev = await getImageSrc(data_prev);
//         //console.log(`prev image: ${img_prev}`);
//         //get the species url of the previous evolution
//         let url_prev_species = data_prev['species']['url'];
//         //console.log(`url_prev_species: ${url_prev_species}`);
//         await displayPrevEvolutionImg(url_prev_species);
//     }
//     return evolution_images;
//     // else {
//       //  return 'no previous evolution';
//    // }
// }
//
const displayPrevEvolution = async (url) => {
    let data = await fetchData(url);
    let prev = data['evolves_from_species'];
    //continue only if a previous evolution exists
    if (prev) {
        let name_prev = prev['name'];
        //fetch data of prev evolution
        let url_prev = baseUrl+'/'+name_prev;
        let data_prev = await fetchData(url_prev);
        let img_prev = await getImageSrc(data_prev);
        //console.log(`prev image: ${img_prev}`);
        //get the species url of the previous evolution
        let url_prev_species = data_prev['species']['url'];
        //recursive so all previous evolutions are added
        let earlier_ev = displayPrevEvolution(url_prev_species);
        return (name_prev, img_prev);
    } else {
        return 'no previous evolution';
    }
}

const btn = document.getElementById('run');
const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

btn.addEventListener("click", () => {
    const input = document.getElementById('in').value;
    //console.log(input);
    let url_p = baseUrl+'/'+input;
    let url_e = baseUrl+'-species/'+input;
    //fetchData(url_p).then(data => console.log(data));
    displayPokemon(url_p);
    displayPrevEvolution(url_e).then(prev => {console.log(prev)});
    //displayPrevEvolutionName(url_e).then(a => {console.log(a)});
    //displayPrevEvolutionName(url_e);
    //displayPrevEvolutionImg(url_e).then(b => {console.log(b)});
    //getPrevEvName(url_e);
})