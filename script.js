//todo: limit input to existing pokemons?
//todo: make it possible to see > 4 abilities / randomize abilities
//todo: is an action necessary if no previous evolution exists?

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
        console.log('try a lower number or a different spelling')
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
        console.log(mv['move']['name']);
    }
}

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
        return img_prev;
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

})