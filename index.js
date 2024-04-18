
// Hämta referenser till elementen
const pokeGameLogo = document.getElementById("pokeGame");


//Pokémon-gallery-container
const pokemonGalleryContainer = document.getElementById('pokemon-gallery-container');
const loadPokemonsBtn = document.getElementById("load-Pokemons-Btn");
const searchPokemonInput = document.getElementById("search-input");
const pokemonDetails = document.getElementById('pokemon-details');
const listWrapper = document.getElementById('list-wrapper');
const pokemonDetailsContainer = document.getElementById('pokemon-details-container');


class Pokemon {
    constructor(name, image, types, weight, height, hp, attack, specialAttack, defense, specialDefense, speed) {
        this.name = name;
        this.image = image;
        this.types = types;
        this.weight = weight;
        this.height = height;
        this.stats = {
            "HP": hp,
            "Attack": attack,
            "Special Attack": specialAttack,
            "Defense": defense,
            "Special Defense": specialDefense,
            "Speed": speed
        };
    }

    // Metod för att jämföra två Pokémon-objekt
    compare(pokemon) {
        // Beräkna total vikt och längd för båda Pokémon
        const thisTotalWeight = this.weight;
        const thisTotalHeight = this.height;
        const pokemonTotalWeight = pokemon.weight;
        const pokemonTotalHeight = pokemon.height;

        // Beräkna total statistik för båda Pokémon
        const thisTotalStats = Object.values(this.stats).reduce((total, stat) => total + stat, 0);
        const pokemonTotalStats = Object.values(pokemon.stats).reduce((total, stat) => total + stat, 0);

        // Jämför längd, vikt och total statistik
        if (thisTotalHeight > pokemonTotalHeight && thisTotalWeight > pokemonTotalWeight && thisTotalStats > pokemonTotalStats) {
            return `${this.name} är större och starkare än ${pokemon.name}.`;
        } else if (thisTotalHeight < pokemonTotalHeight && thisTotalWeight < pokemonTotalWeight && thisTotalStats < pokemonTotalStats) {
            return `${this.name} är mindre och svagare än ${pokemon.name}.`;
        } else {
            // Om ingen av ovanstående villkor är uppfyllda, returnera ett anpassat meddelande
            return `Jämförelse saknas för ${this.name} och ${pokemon.name}.`;
        }
    }
}

// Definiera limit globalt
const limit = 151;

document.addEventListener('DOMContentLoaded', function () {
    const fetchPokemons = async () => {
        try {
            const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

            const response = await fetch(`${apiUrl}?limit=${limit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Extrahera specifika värden från varje pokémon och skapa instanser av Pokemon-klassen
            const extractedPokemonData = data.results.map(async pokemon => {
                const pokemonResponse = await fetch(pokemon.url);
                if (!pokemonResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const pokemonData = await pokemonResponse.json();
                return new Pokemon(
                    pokemon.name,
                    pokemonData.sprites.front_default,
                    pokemonData.types.map(type => type.type.name),
                    pokemonData.weight,
                    pokemonData.height,
                    pokemonData.stats[0].base_stat,
                    pokemonData.stats[1].base_stat,
                    pokemonData.stats[2].base_stat,
                    pokemonData.stats[3].base_stat,
                    pokemonData.stats[4].base_stat,
                    pokemonData.stats[5].base_stat
                );
            });

            // Vänta på att alla pokémon ska bearbetas och returnera instanserna
            const pokemons = await Promise.all(extractedPokemonData);

            console.log('All Pokémon instances:', pokemons);
            return pokemons;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // Anropa funktionen för att hämta alla pokémon
    fetchPokemons();




    // Funktion för att skapa en pokémonImageDiv till pokémonGalleryContainer
    const createPokemonImage = (pokemon) => {
        // Skapa ett div-element för varje Pokémon
        const pokemonImageDiv = document.createElement('div');
        pokemonImageDiv.classList.add('pokemon-image-div');

        // Skapa ett h2-element för Pokémonens namn
        const nameHeading = document.createElement('h2');
        nameHeading.classList.add('pokemon-h2');
        nameHeading.textContent = pokemon.name;

        // Skapa ett img-element för Pokémonens bild
        const pokemonImage = document.createElement('img');
        pokemonImage.classList.add('pokemon-image');
        pokemonImage.src = pokemon.image;
        pokemonImage.alt = pokemon.name;

        // Skapa knappen för att visa detaljer
        const detailsButton = document.createElement('button');
        detailsButton.classList.add('details-button');
        detailsButton.textContent = 'Välj pokémon';
        detailsButton.style.display = 'none'; // Göm knappen som standard

        // Lägg till händelsehanterare för att visa knappen när användaren hovrar över bilden
        pokemonImageDiv.addEventListener('mouseenter', () => {
            detailsButton.style.display = 'block';
        });

        // Lägg till händelsehanterare för att dölja knappen när användaren inte längre hovrar över bilden
        pokemonImageDiv.addEventListener('mouseleave', () => {
            detailsButton.style.display = 'none';
        });

        // Lägg till eventlyssnare för detaljknappen
        detailsButton.addEventListener('click', () => {
            renderPokemonCard(pokemon);
            pokemonGalleryContainer.style.display = 'none';
            pokemonDetailsContainer.style.display = 'block';

        });

        // Lägg till namn, bild och knapp i pokémon-diven
        pokemonImageDiv.appendChild(nameHeading);
        pokemonImageDiv.appendChild(pokemonImage);
        pokemonImageDiv.appendChild(detailsButton);

        // Lägg till pokémon-diven i listWrapper
        listWrapper.appendChild(pokemonImageDiv);


    };


    let renderedPokemons = 0; // Variabel för att hålla reda på antalet renderade pokémons
    const maxRenderedPokemons = 150; // Maximalt antal pokémons att rendera

    const renderPokemonImage = async () => {
        const pokemons = await fetchPokemons();

        if (pokemons) { // Kontrollera om pokemons är tillgängliga
            // Fortsätt med att rendera pokemons
            // Ta bort befintliga pokémons från gameWrapper
            listWrapper.innerHTML = '';

            // Loopa igenom pokémons och rendera dem i listWrapper
            for (let i = renderedPokemons; i < renderedPokemons + 6 && i < pokemons.length && i < maxRenderedPokemons; i++) {
                createPokemonImage(pokemons[i], listWrapper);
            }

            // Uppdatera räknaren för renderade pokémons
            renderedPokemons += 6;
        } else {
            // Om det inte finns några pokémons, gör något annat eller ge ett meddelande
            console.error('No pokemons available to render.');
        }

    };

    // Funktion för att skapa en detaljkort för en Pokemon
    const createPokemonDetailsCard = (pokemon) => {
        // Hämta pokemon-details-elementet från HTML
        const pokemonDetails = document.getElementById('pokemon-details');

        // Kontrollera om pokemon-objektet är tillgängligt och pokemon-details-elementet finns
        if (pokemon && pokemonDetails) {
            // Skapa en ny div för hela Pokémon-kortet
            const pokemonCardContainer = document.createElement('div');
            pokemonCardContainer.classList.add('pokemon-card-container');

            // Skapa en ny h2 för Pokémon-namnet och lägg till det i pokemonCardContainer
            const pokemonNameHeading = document.createElement('h2');
            pokemonNameHeading.textContent = pokemon.name;
            pokemonCardContainer.appendChild(pokemonNameHeading);

            // Skapa en div för varje detalj och lägg till dem i pokemonCardContainer
            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('details-div');

            // Lägg till vikt
            const weightPara = document.createElement('p');
            weightPara.textContent = `Weight: ${pokemon.weight} kg`;
            detailsDiv.appendChild(weightPara);

            // Lägg till höjd
            const heightPara = document.createElement('p');
            heightPara.textContent = `Height: ${pokemon.height} m`;
            detailsDiv.appendChild(heightPara);

            // Lägg till statistik
            const statsHeading = document.createElement('h3');
            statsHeading.textContent = 'Stats:';
            detailsDiv.appendChild(statsHeading);

            const statsList = document.createElement('ul');
            for (const [stat, value] of Object.entries(pokemon.stats)) {
                const statItem = document.createElement('li');
                statItem.textContent = `${stat}: ${value}`;
                statsList.appendChild(statItem);
            }
            detailsDiv.appendChild(statsList);

            // Lägg till typer
            const typesHeading = document.createElement('h3');
            typesHeading.textContent = 'Types:';
            detailsDiv.appendChild(typesHeading);

            const typesList = document.createElement('ul');
            pokemon.types.forEach(type => {
                const typeItem = document.createElement('li');
                typeItem.textContent = type;
                typesList.appendChild(typeItem);
            });
            detailsDiv.appendChild(typesList);

            // Lägg till detaljerna i pokemonCardContainer
            pokemonCardContainer.appendChild(detailsDiv);

            // Skapa en img-element för Pokémonens bild och lägg till den i pokemonCardContainer
            const pokemonImage = document.createElement('img');
            pokemonImage.classList.add('pokemon-image');
            pokemonImage.src = pokemon.image;
            pokemonImage.alt = pokemon.name;
            pokemonCardContainer.appendChild(pokemonImage);

            // Lägg till pokemonCardContainer i pokemon-details-elementet
            pokemonDetails.appendChild(pokemonCardContainer);


        } else {
            console.error('Pokemon object is not available or pokemon-details element does not exist.');
        }
    };


    const closeButton = document.getElementById('close-button');


    closeButton.addEventListener('click', () => {
        // Dölj detaljkortet när knappen stängs
        pokemonDetails.style.display = 'none';
        pokemonGalleryContainer.style.display = 'block'; // Visar pokémon-galleriet igen
        pokemonDetailsContainer.style.display = 'none';

    });

    let selectedPokemons = [];
    let pokemon1 = null;
    let pokemon2 = null;


    const renderPokemonCard = (pokemon) => {

        console.log(selectedPokemons);

        closeButton.style.display = 'block';

        // Kontrollera om pokemon1 är null och sätt den till det första objektet i selectedPokemons
        if (pokemon1 === null) {
            pokemon1 = pokemon;
        }
        // Annars om pokemon2 är null, sätt den till det andra objektet i selectedPokemons
        else if (pokemon2 === null) {
            pokemon2 = pokemon;
        }

        // Kontrollera om arrayen för valda pokémons redan innehåller två pokémons
        if (selectedPokemons.length === 2) {
            // Ta bort den första pokémonen från arrayen för att göra plats för den nya
            selectedPokemons.shift();
        }
        // Kontrollera om den nya pokémonen redan finns i arrayen
        const isNewPokemon = !selectedPokemons.some(selectedPokemon => selectedPokemon.name === pokemon.name);
        if (isNewPokemon) {
            // Lägg till den nya pokémonen i arrayen
            selectedPokemons.push(pokemon);

            // Rensa innehållet i pokemon-details-elementet
            const pokemonDetails = document.getElementById('pokemon-details');
            if (pokemonDetails) {
                pokemonDetails.innerHTML = '';
            }

            // Skapa detaljkort för de senast valda pokémons
            selectedPokemons.forEach(selectedPokemon => {
                createPokemonDetailsCard(selectedPokemon);
            });

            // Visa pokemon-details-elementet
            if (pokemonDetails) {
                pokemonDetails.style.display = 'block';
            }

            // Lägg till knapp för att jämföra Pokémon om det finns två valda pokémons
            if (selectedPokemons.length === 2) {
                const compareButton = document.createElement('button');
                compareButton.classList.add('compare-button');

                compareButton.textContent = 'Jämför Pokémon';
                pokemonDetails.appendChild(compareButton);
            }
        }
    };

    loadPokemonsBtn.addEventListener('click', () => {

        renderPokemonImage();
    });



    // Uppdatera comparePokemons-funktionen för att använda pokémons i selectedPokemons-arrayen
    const comparePokemons = (selectedPokemons) => {
        // Kontrollera om arrayen för valda pokémons innehåller minst två pokémons
        if (selectedPokemons.length >= 2) {
            const pokemon1 = selectedPokemons[0];
            const pokemon2 = selectedPokemons[1];

            // Använd compare-metoden från Pokemon-klassen för att jämföra de två Pokémon-objekten
            const comparisonResult = pokemon1.compare(pokemon2);

            // Visa jämförelseresultatet i gränssnittet
            const comparisonResultDiv = document.getElementById('comparison-result');
            comparisonResultDiv.textContent = comparisonResult;
            comparisonResultDiv.style.display = 'block'; // Visa jämförelseresultatet
        } else {
            // Om inte tillräckligt med pokémons är valda, ge ett felmeddelande
            console.error('At least two pokemons must be selected for comparison.');
        }
    };

    // Uppdatera klickhändelsen för jämförelseknappen
    compareButton.addEventListener('click', () => {
        // Kontrollera om tillräckligt med pokémons är valda för jämförelse
        if (selectedPokemons.length >= 2) {
            // Anropa funktionen för att jämföra Pokémon med de valda pokémons i arrayen
            comparePokemons(selectedPokemons);
        } else {
            console.error('At least two pokemons must be selected for comparison.');
        }
    });

    // Funktion för att söka efter en Pokémon
    const searchPokemon = async () => {
        const searchTerm = searchPokemonInput.value.toLowerCase(); // Hämta söktermen och omvandla till gemener
        const pokemons = await getPokemon(); // Hämta alla Pokémon

        // Filtera ut den sökta Pokémonen
        const searchedPokemon = pokemons.find(pokemon => pokemon.name.toLowerCase() === searchTerm);

        // Om den sökta Pokémonen hittades, rendera den i imageContent
        if (searchedPokemon) {
            listWrapper.innerHTML = '';

            // Skapa en pokémonbild för den sökta Pokémonen och lägg till den i imageContent
            createPokemonImage(searchedPokemon, listWrapper);
        } else {
            // Om den sökta Pokémonen inte hittades, meddela användaren
            alert('Pokémon not found!');
        }
    };

    // Lägg till en klickhändelse för knappen för att söka efter Pokémon
    document.getElementById('search-btn').addEventListener('click', searchPokemon);

    // Lyssna på 'Enter'-tangenten i sökfältet för att starta sökningen
    searchPokemonInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchPokemon();
        }
    });

    // Funktion för att fylla sökfältet med valt namn
    const fillSearchInput = (name) => {
        searchPokemon.value = name;
    };

    // Funktion för att visa sökresultaten i dropdown
    const showSearchResults = (results) => {
        const searchResultsDiv = document.getElementById('search-results');
        searchResultsDiv.innerHTML = ''; // Rensa tidigare sökresultat

        // Skapa och lägg till en <p> för varje sökresultat i dropdown
        results.forEach(result => {
            const p = document.createElement('p');
            p.textContent = result.name;
            p.addEventListener('click', () => {
                // När användaren klickar på ett sökresultat, fyll sökfältet med det valda namnet
                searchPokemonInput.value = result.name;
                // Starta sökningen direkt när användaren väljer ett alternativ
                searchPokemon();
                // Dölj dropdown efter att användaren har valt ett alternativ
                searchResultsDiv.style.display = 'none';
            });
            searchResultsDiv.appendChild(p);
        });

        // Visa dropdown
        searchResultsDiv.style.display = 'block';
    };

    // Funktion för att hantera sökningen och visa sökresultat i dropdown
    const handleSearch = async () => {
        const searchTerm = searchPokemonInput.value.trim().toLowerCase(); // Trimma bort eventuella tomma tecken och gör om till gemener
        const pokemons = await fetchPokemons();

        // Kontrollera om söktermen är minst en bokstav lång
        if (searchTerm.length > 0) {
            // Filtrera pokémon med namn som börjar med den inmatade söktermen
            const searchResults = pokemons.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchTerm));

            // Visa sökresultaten i dropdown om det finns några
            if (searchResults.length > 0) {
                showSearchResults(searchResults);
            } else {
                // Om inga sökresultat hittades, dölj dropdown
                document.getElementById('search-results').style.display = 'none';
            }
        } else {
            // Om söktermen är tom, dölj dropdown
            document.getElementById('search-results').style.display = 'none';
        }
    };

    // Lyssna på tangenttryckningar i sökfältet för att hantera sökningen
    searchPokemonInput.addEventListener('input', handleSearch);

    // Lyssna på fokushändelsen i sökfältet för att rensa det när användaren klickar inuti
    searchPokemonInput.addEventListener('focus', () => {
        searchPokemonInput.value = ''; // Rensa sökfältet när det får fokus
        imageContent.innerHTML = ''; // Rensa imageContent
        renderPokemonImage(); // Rendera pokémon när sökfältet får fokus
    });

});
