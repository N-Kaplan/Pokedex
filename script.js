const btn = document.getElementById('run');
const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

const mainImg = document.getElementById('pokemon_img');
const mainPokemon = document.getElementById('pokemon_name');
const mainMoves = document.getElementById('moves');
const pokEvolutions = document.getElementById('evolution');

const fetchData = async (url) => {
    try {
        let data = await fetch(url);
        let parsedData = await data.json();
        return parsedData;
    }
    catch (error) {
        console.error(error);
    }
}

const getImageSrc = async(data) => {
    return await data['sprites']['front_default'];
}

const getPokemon = async (url) => {
    let data = await fetchData(url);
    let name = data['name'];
    let id = data['id'];
    let sprite = await getImageSrc(data);
    let moves = data['moves'];

    let moves_disp = [];
    if (moves.length < 4) {
        moves_disp = moves;
    } else {
        moves_disp = moves.slice(0,4);
    }
    let move_names = [];
    for (const mv of moves_disp) {
        move_names.push(mv['move']['name']);
    }
    let pokemon = [name, id, move_names, sprite];
    return (pokemon);
}

const getEvolution = async (name) => {
    let url = baseUrl + '-species/' + name;
    let data = await fetchData(url);
    let chain_url = data['evolution_chain']['url'];
    let evolution = await fetchData(chain_url);
    let evo_names_list = [evolution['chain']['species']['name']];
    if (evolution['chain']['evolves_to'].length !== 0) {
        for (let evo of evolution['chain']['evolves_to']) {
            evo_names_list.push(evo['species']['name']);

            if (evo['evolves_to'].length !== 0) {
                for (let evo2 of evo['evolves_to']) {
                    evo_names_list.push(evo2['species']['name']);
                }
            }
        }
        return evo_names_list;
    }
}

const getImgFromName = async (name) => {
    let url = baseUrl + '/' + name;
    let data = await fetchData(url);
    return getImageSrc(data);
}



btn.addEventListener("click", async() => {
    mainMoves.innerHTML = '';
    pokEvolutions.innerHTML = '';
    const input = document.getElementById('in').value;
    let url_p = baseUrl+'/'+input;
    let pokemon = await getPokemon(url_p);
    let evo_name_arr = await getEvolution(input);
    //get images
    let evo_img_arr = [];
    for (let i in evo_name_arr) {
        evo_img_arr.push(await getImgFromName(evo_name_arr[i]));
    }

    mainImg.src = pokemon[3];
    mainPokemon.textContent = `${pokemon[1]}. ${pokemon[0]}`;

    //add moves
    if (pokemon[2].length !== 0) {
        //console.log(pokemon[2])
        const m_title = document.createElement('H3');
        m_title.textContent = "Moves:";
        let u = document.createElement('UL');
        u.classList.add('moves-ul');
        mainMoves.appendChild(u);
        for (let mv of pokemon[2]) {
            let l = document.createElement('LI');
            l.classList.add('moves-li');
            let p = document.createElement('P');
            p.classList.add('moves-p');
            let i = document.createElement('I');
            i.classList.add('move-content');
            i.textContent = mv;
            p.appendChild(i);
            l.appendChild(p);
            u.appendChild(l);
        }
    }
    //add evolutions
    if (evo_img_arr.length > 1) {
        const e_title = document.createElement('H3');
        e_title.textContent = "Evolutions:";
        e_title.classList.add('moves-ul');
        pokEvolutions.appendChild(e_title);
        for (let i = 0; i < evo_img_arr.length; i++) {
            let im = document.createElement('IMG');
            im.src = evo_img_arr[i];
            im.alt = evo_name_arr[i];
            pokEvolutions.appendChild(im);
        }
    }
})

