
// Hämta referenser till elementen
const pokeGameLogo = document.getElementById("pokeGame");


//Pokémon-gallery-container
const pokemonGalleryContainer = document.getElementById('pokemon-gallery-container');
const loadPokemonsBtn = document.getElementById("load-Pokemons-Btn");
const searchPokemonInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const listWrapper = document.getElementById('list-wrapper');
const pokemonDetailsContainer = document.getElementById('pokemon-details-container');
const comparePokemonButton = document.createElement('button');
const pokemonCardWrapper = document.getElementById('pokemon-card-wrapper');
const pokemonCardWrapperBtnBox = document.querySelector('.btn-box');
const infoPopup = document.getElementById('info-popup');



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
        this.compared = {};
        this.wins = 0;
    }


    // Uppdaterad compare-metod för att använda getHighestStat och getHighestValue
    static compare(pokemon1, pokemon2) {
        // Återställ poängen för varje jämförelse
        pokemon1.wins = 0;
        pokemon2.wins = 0;

        // Jämför statistikattribut
        for (const stat in pokemon1.stats) {
            getHighestStat(pokemon1, pokemon2, stat);
        }

        // Jämför andra attribut som vikt och höjd
        getHighestValue(pokemon1, pokemon2, "weight");
        getHighestValue(pokemon1, pokemon2, "height");

        // Beräkna poäng baserat på jämförelserna
        for (const key in pokemon1.compared) {
            if (pokemon1.compared[key].isHighest) {
                pokemon1.wins++; // Öka antalet vinster för pokemon1
            } else if (pokemon2.compared[key].isHighest) {
                pokemon2.wins++; // Öka antalet vinster för pokemon2
            }
        }
    }

}

// Uppdaterad getHighestStat för att jämföra statistikattribut
const getHighestStat = (pokemon1, pokemon2, statName) => {
    if (pokemon1.stats[statName] > pokemon2.stats[statName]) {
        pokemon1.compared[statName] = {
            name: statName,
            value: pokemon1.stats[statName],
            isHighest: true,
        };
        pokemon2.compared[statName] = {
            name: statName,
            value: pokemon2.stats[statName],
            isHighest: false,
        };
    } else if (pokemon2.stats[statName] > pokemon1.stats[statName]) {
        pokemon1.compared[statName] = {
            name: statName,
            value: pokemon1.stats[statName],
            isHighest: false,
        };
        pokemon2.compared[statName] = {
            name: statName,
            value: pokemon2.stats[statName],
            isHighest: true,
        };
    } else {
        // Om värdena är lika ska ingen få poäng
        pokemon1.compared[statName] = {
            name: statName,
            value: pokemon1.stats[statName],
            isHighest: false,
        };
        pokemon2.compared[statName] = {
            name: statName,
            value: pokemon2.stats[statName],
            isHighest: false,
        };
    }
};

// Uppdaterad getHighestValue för att jämföra andra attribut
const getHighestValue = (pokemon1, pokemon2, valueName) => {
    if (pokemon1[valueName] > pokemon2[valueName]) {
        pokemon1.compared[valueName] = {
            name: valueName,
            value: pokemon1[valueName],
            isHighest: true,
        };
        pokemon2.compared[valueName] = {
            name: valueName,
            value: pokemon2[valueName],
            isHighest: false,
        };
    } else if (pokemon2[valueName] > pokemon1[valueName]) {
        pokemon1.compared[valueName] = {
            name: valueName,
            value: pokemon1[valueName],
            isHighest: false,
        };
        pokemon2.compared[valueName] = {
            name: valueName,
            value: pokemon2[valueName],
            isHighest: true,
        };
    } else {
        // Om värdena är lika ska ingen få poäng
        pokemon1.compared[valueName] = {
            name: valueName,
            value: pokemon1[valueName],
            isHighest: false,
        };
        pokemon2.compared[valueName] = {
            name: valueName,
            value: pokemon2[valueName],
            isHighest: false,
        };
    }
};





document.addEventListener('DOMContentLoaded', function () {


    pokemonGalleryContainer.style.display = 'block';

    const fetchPokemons = async () => {

        const limit = 151;

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



    // Funktion för att skapa ett Pokémon-element
    const createPokemonElement = (pokemon) => {
        const pokemonImageDiv = document.createElement('div');
        pokemonImageDiv.classList.add('pokemon-image-div');

        const nameHeading = document.createElement('h2');
        nameHeading.classList.add('pokemon-h2');
        nameHeading.textContent = pokemon.name;

        const pokemonImage = document.createElement('img');
        pokemonImage.classList.add('pokemon-image');
        pokemonImage.src = pokemon.image;
        pokemonImage.alt = pokemon.name;

        const selectPokemonBtn = document.createElement('button');
        selectPokemonBtn.classList.add('details-button');
        selectPokemonBtn.textContent = 'Välj pokémon';
        selectPokemonBtn.style.display = 'none';

        // Lägg till händelselyssnare för att visa knappen när användaren hovrar över bilden
        pokemonImageDiv.addEventListener('mouseenter', () => {
            selectPokemonBtn.style.display = 'block';
        });

        // Lägg till händelselyssnare för att dölja knappen när användaren inte längre hovrar över bilden
        pokemonImageDiv.addEventListener('mouseleave', () => {
            selectPokemonBtn.style.display = 'none';
        });

        selectPokemonBtn.addEventListener('click', () => {
            const selectedPokemon = pokemon;

            if (selectedPokemons.some(pokemon => pokemon.name === selectedPokemon.name)) {
                alert('You have already chosen this Pokemon, choose another one!');
                return;
            }

            selectedPokemons.push(selectedPokemon);
            renderSelectedPokemonDetails(selectedPokemon);
            pokemonGalleryContainer.style.display = 'none';
            pokemonDetailsContainer.style.display = 'block';
        });

        pokemonImageDiv.appendChild(nameHeading);
        pokemonImageDiv.appendChild(pokemonImage);
        pokemonImageDiv.appendChild(selectPokemonBtn);

        return pokemonImageDiv;
    };

    let renderedPokemons = 0; // Variabel för att hålla reda på antalet renderade pokémons
    const maxRenderedPokemons = 150; // Maximalt antal pokémons att rendera


    const renderPokemonGallery = async () => {
        const pokemons = await fetchPokemons();

        if (pokemons) {
            listWrapper.innerHTML = '';

            for (let i = renderedPokemons; i < renderedPokemons + 6 && i < pokemons.length && i < maxRenderedPokemons; i++) {
                const pokemon = pokemons[i];
                const pokemonElement = createPokemonElement(pokemon);
                listWrapper.appendChild(pokemonElement);
            }

            renderedPokemons += 6;

            if (renderedPokemons >= pokemons.length) {
                renderedPokemons = 0;
            }
        } else {
            console.error('No pokemons available to render.');
        }
    };

    renderPokemonGallery();


    // Deklarera knappen
    const loadPokemonsBtn = document.getElementById("load-Pokemons-Btn");

    // Lägg till händelselyssnaren för knappen
    loadPokemonsBtn.addEventListener('click', () => {
        renderPokemonGallery();
        searchPokemonInput.value = '';
    });


    const goBackBtn = document.getElementById('go-back-button');


    goBackBtn.addEventListener('click', () => {
        renderPokemonGallery();
        // Dölj detaljkortet när knappen stängs
        pokemonGalleryContainer.style.display = 'block'; // Visar pokémon-galleriet igen
        pokemonDetailsContainer.style.display = 'none';

    });

    let selectedPokemons = [];
    let pokemon1 = null;
    let pokemon2 = null;




    // Funktion för att rendera detaljerna för en vald Pokémon i dess kort
    const renderSelectedPokemonDetails = (pokemon) => {
        // Skapa stängningsknappen
        const deletePokemonBtn = document.createElement('button');
        deletePokemonBtn.classList.add('delete-pokemon-button');
        deletePokemonBtn.innerHTML = '<i class="fas fa-trash-alt" style="font-size: 20px; color: blue;"></i>';

        // Lägg till händelselyssnare för stängningsknappen
        deletePokemonBtn.addEventListener('click', () => {
            // Ta bort det aktuella pokemon-detail-kortet från DOM:en
            pokemonDetailCard.remove();
            // Ta bort den aktuella pokemonen från selectedPokemons-arrayen
            const index = selectedPokemons.indexOf(pokemon);
            if (index !== -1) {
                selectedPokemons.splice(index, 1);
            }

            // Kontrollera om selectedPokemons-arrayen är tom
            if (selectedPokemons.length === 0) {
                // Om selectedPokemons är tom, visa pokemon-gallery-container och dölj pokemon-details-container
                pokemonGalleryContainer.style.display = 'block';
                pokemonDetailsContainer.style.display = 'none';
            } else if (selectedPokemons.length === 1) {
                // Om selectedPokemon är index 1 och selectedPokemons har en längd på 1, ersätt compareButton med closeButton
                comparePokemonButton.style.display = 'none';
                goBackBtn.style.display = 'block';
                infoPopup.style.display = 'block';
            }
        });

        // Skapa ett div-element för detaljkortet
        const pokemonDetailCard = document.createElement('div');
        pokemonDetailCard.classList.add('pokemon-detail-card');

        // Skapa en bild för pokemonen
        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.image;
        pokemonImage.alt = pokemon.name;

        // Skapa en rubrik för pokemonens namn
        const pokemonName = document.createElement('h3');
        pokemonName.textContent = pokemon.name;

        // Skapa en div för typer
        const typesDiv = document.createElement('div');
        typesDiv.classList.add('pokemon-types');

        // Loopa igenom varje typ och skapa en span för varje typ
        pokemon.types.forEach(type => {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = type;
            typesDiv.appendChild(typeSpan);
        });

        // Skapa en div för vikt och höjd
        const weightHeightDiv = document.createElement('div');
        weightHeightDiv.classList.add('weight-height');

        // Skapa span-element för vikt och höjd
        const weightSpan = document.createElement('span');
        weightSpan.innerHTML = `<i class="fas fa-weight-hanging"></i> Weight: ${pokemon.weight}`;

        const heightSpan = document.createElement('span');
        heightSpan.innerHTML = `<i class="fas fa-ruler-vertical"></i> Height: ${pokemon.height}`;

        // Lägg till vikt och höjd till weightHeightDiv
        weightHeightDiv.appendChild(weightSpan);
        weightHeightDiv.appendChild(heightSpan);

        // Skapa en lista för pokemonens attribut
        const pokemonAttributeList = document.createElement('ul');

        // Loopa igenom pokemonens attribut och lägg till dem i listan
        for (const attribute in pokemon.stats) {
            const attributeItem = document.createElement('li');
            attributeItem.textContent = `${attribute}: ${pokemon.stats[attribute]}`;
            pokemonAttributeList.appendChild(attributeItem);
        }

        // Lägg till bild, namn, typer, vikt, höjd och attributlista till detaljkortet
        pokemonDetailCard.appendChild(pokemonImage);
        pokemonDetailCard.appendChild(pokemonName);
        pokemonDetailCard.appendChild(typesDiv);
        pokemonDetailCard.appendChild(weightHeightDiv);
        pokemonDetailCard.appendChild(pokemonAttributeList);
        // Lägg till stängningsknappen till detaljkortet
        pokemonDetailCard.appendChild(deletePokemonBtn);
        pokemonCardWrapperBtnBox.appendChild(goBackBtn);
        pokemonCardWrapperBtnBox.appendChild(comparePokemonButton);
        pokemonCardWrapper.appendChild(pokemonDetailCard);

        // Kolla om två pokémon har valts
        if (selectedPokemons.length === 2) {
            // När två pokémon har valts, logga arrayen
            console.log('Selected Pokemons:', selectedPokemons);
            // Visa jämförelseknappen
            comparePokemonButton.classList.add('compare-button');
            comparePokemonButton.textContent = 'Jämför Pokemon';
            comparePokemonButton.style.display = 'block';
            infoPopup.style.display = 'none';
            goBackBtn.style.display = 'none';
        } else {
            // Om det inte är två valda pokémon, visa goBackBtn och dölj compareButton
            goBackBtn.style.display = 'block';
            comparePokemonButton.style.display = 'none';
            infoPopup.style.display = 'block';
        }
    };







    // Hämta referensen till knappen "Add Pokémon"
    const addPokemonButton = document.getElementById('add-pokemon');

    // Lägg till en händelselyssnare för klickhändelse på knappen "Add Pokémon"
    addPokemonButton.addEventListener('click', () => {
        // Gör pokemon-gallery-container synligt
        pokemonGalleryContainer.style.display = 'block';

        // Göm pokemon-details-container
        pokemonDetailsContainer.style.display = 'none';
    });




    // Hämta referensen till stängningsknappen
    const closeInfoPopupButton = document.getElementById('close-info-popup');
    // Lägg till en händelselyssnare för att dölja info-popup när användaren klickar på stängningsknappen
    closeInfoPopupButton.addEventListener('click', () => {
        infoPopup.style.display = 'none'; // Dölj info-popup när användaren klickar på stängningsknappen

    });





    const renderSelectedPokemonComparison = (pokemon1, pokemon2) => {
        // Ta bort befintligt innehåll från pokemon-card-wrapper
        pokemonCardWrapper.innerHTML = '';

        // Skapa detaljkort för varje Pokémon med samma layout som renderSelectedPokemonDetails
        const pokemon1DetailCard = createPokemonDetailCard(pokemon1);
        const pokemon2DetailCard = createPokemonDetailCard(pokemon2);

        // Lägg till Pokémon-divarna i pokemon-card-wrapper
        pokemonCardWrapper.appendChild(pokemon1DetailCard);
        pokemonCardWrapper.appendChild(pokemon2DetailCard);
    };

    // Funktion för att rendera detaljkortet för en pokemon
    const createPokemonDetailCard = (pokemon) => {
        // Skapa ett div-element för detaljkortet
        const pokemonDetailCard = document.createElement('div');
        pokemonDetailCard.classList.add('pokemon-detail-card');

        // Skapa en bild för pokemonen
        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.image;
        pokemonImage.alt = pokemon.name;

        // Skapa en rubrik för pokemonens namn
        const pokemonName = document.createElement('h3');
        pokemonName.textContent = pokemon.name;

        // Skapa en div för typer
        const typesDiv = document.createElement('div');
        typesDiv.classList.add('pokemon-types');

        // Loopa igenom varje typ och skapa en span för varje typ
        pokemon.types.forEach(type => {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = type;
            typesDiv.appendChild(typeSpan);
        });

        // Skapa en div för vikt och höjd
        const weightHeightDiv = document.createElement('div');
        weightHeightDiv.classList.add('weight-height');

        // Skapa span-element för vikt och höjd
        const weightSpan = document.createElement('span');
        weightSpan.innerHTML = `<i class="fas fa-weight-hanging"></i> Weight: ${pokemon.weight}`;

        const heightSpan = document.createElement('span');
        heightSpan.innerHTML = `<i class="fas fa-ruler-vertical"></i> Height: ${pokemon.height}`;

        // Lägg till vikt och höjd till weightHeightDiv
        weightHeightDiv.appendChild(weightSpan);
        weightHeightDiv.appendChild(heightSpan);

        // Markera vikt och höjd med rätt färg beroende på isHighest-värdet
        if (pokemon.compared.weight.isHighest) {
            weightSpan.classList.add('highest-value');
        } else {
            weightSpan.classList.add('lowest-value');
        }

        if (pokemon.compared.height.isHighest) {
            heightSpan.classList.add('highest-value');
        } else {
            heightSpan.classList.add('lowest-value');
        }

        // Skapa en lista för pokemonens attribut
        const pokemonAttributeList = document.createElement('ul');

        // Loopa igenom pokemonens attribut och lägg till dem i listan
        for (const attribute in pokemon.stats) {
            const attributeItem = document.createElement('li');
            attributeItem.textContent = `${attribute}: ${pokemon.stats[attribute]}`;

            // Om pokemon har det högsta värdet för attributet, markera attributet som grönt, annars som rött
            if (pokemon.compared[attribute].isHighest) {
                attributeItem.classList.add('highest-value');
            } else {
                attributeItem.classList.add('lowest-value');
            }

            pokemonAttributeList.appendChild(attributeItem);
        }

        // Lägg till bild, namn, typer, vikt, höjd och attributlista till detaljkortet
        pokemonDetailCard.appendChild(pokemonImage);
        pokemonDetailCard.appendChild(pokemonName);
        pokemonDetailCard.appendChild(typesDiv);
        pokemonDetailCard.appendChild(weightHeightDiv);
        pokemonDetailCard.appendChild(pokemonAttributeList);



        // Om det är vinnaren, lägg till "Winner" -indikatorn
        if (pokemon === winnerPokemon) {
            const winnerIndicator = document.createElement('div');
            winnerIndicator.classList.add('winner-indicator');
            winnerIndicator.textContent = 'Winner';
            pokemonDetailCard.appendChild(winnerIndicator);
        } else {
            // Om det är förloraren, lägg till "Loser" -indikatorn
            const loserIndicator = document.createElement('div');
            loserIndicator.classList.add('loser-indicator');
            loserIndicator.textContent = 'Loser';
            pokemonDetailCard.appendChild(loserIndicator);
        }

        return pokemonDetailCard;
    };

    let winnerPokemon = null; // Variabel för att hålla reda på vinnaren 
    let loserPokemon = null; // Variabel för att hålla reda på förloraren

    const comparePokemons = () => {
        // Hämta de två valda pokémons från selectedPokemons-arrayen
        const pokemon1 = selectedPokemons[0];
        const pokemon2 = selectedPokemons[1];

        // Använd Pokemon.compare-metoden för att jämföra pokémons
        Pokemon.compare(pokemon1, pokemon2);

        console.log('Selected Pokémons:', selectedPokemons);

        // Avgör vinnaren baserat på antalet vinster
        if (pokemon1.wins > pokemon2.wins) {
            winnerPokemon = pokemon1;
            loserPokemon = pokemon2; // Sätt även förloraren
        } else if (pokemon2.wins > pokemon1.wins) {
            winnerPokemon = pokemon2;
            loserPokemon = pokemon1; // Sätt även förloraren
        } else {
            winnerPokemon = null; // Om det är lika många vinster, sätt vinnaren till null
            loserPokemon = null; // Sätt även förloraren till null
        }




        // Visa resultatet i DOMen
        renderSelectedPokemonComparison(pokemon1, pokemon2);

        // Göm compareButton
        comparePokemonButton.style.display = 'none';


    };

    // Hämta referensen till stängningsknappen för detaljcontainer
    const closeDetailsContainerButton = document.getElementById('close-details-container');

    // Lägg till en händelselyssnare för klickhändelse på stängningsknappen
    closeDetailsContainerButton.addEventListener('click', () => {
        // Dölj detaljcontainer när användaren klickar på stängningsknappen
        pokemonDetailsContainer.style.display = 'none';
        // Rensa innehållet i detaljcontainer
        pokemonDetailsContainer.innerHTML = '';

        // Visa pokemon-galleriet när användaren stänger detaljcontainer
        pokemonGalleryContainer.style.display = 'block';

        // Ladda om sidan för att återgå till startläget
        window.location.reload();
    });



    comparePokemonButton.addEventListener('click', () => {
        comparePokemons();

        // Göm pokemonGalleryContainer och visa pokemonDetailsContainer
        pokemonGalleryContainer.style.display = 'none';
        pokemonDetailsContainer.style.display = 'block';

    });


    // Funktion för att rendera sökresultatet
    const renderSearchResult = async () => {
        const searchTerm = searchPokemonInput.value.toLowerCase();
        const pokemons = await fetchPokemons();

        if (pokemons) {
            const searchedPokemon = pokemons.find(pokemon => pokemon.name.toLowerCase() === searchTerm);

            if (searchedPokemon) {
                listWrapper.innerHTML = '';
                const pokemonElement = createPokemonElement(searchedPokemon);
                listWrapper.appendChild(pokemonElement);
                searchResultsDropdown.innerHTML = '';
            } else {
                alert('Pokémon not found!');
            }
        }

        // Återställ värdet på sökfältet till en tom sträng
        searchPokemonInput.value = '';
    };

    searchBtn.addEventListener('click', renderSearchResult);

    searchPokemonInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            renderSearchResult();
        }
    });

    const searchResultsDropdown = document.createElement('select');
    searchResultsDropdown.id = 'search-results';
    searchResultsDropdown.classList.add('search-results');
    searchResultsDropdown.style.maxHeight = '150px'; // Maximal höjd för dropdownen, anpassa efter behov
    searchPokemonInput.parentNode.appendChild(searchResultsDropdown);

    // Funktion för att visa sökresultaten i dropdown
    const showSearchResults = (results) => {
        const searchResultsDropdown = document.getElementById('search-results');
        searchResultsDropdown.innerHTML = '';

        results.forEach(result => {
            const option = document.createElement('option');
            option.value = result.name;
            option.textContent = result.name;
            searchResultsDropdown.appendChild(option);
        });

        searchResultsDropdown.style.display = 'block';
    };

    // Funktion för att hantera sökningen och visa sökresultat i dropdown
    const handleSearch = async () => {
        const searchTerm = searchPokemonInput.value.trim().toLowerCase();
        const pokemons = await fetchPokemons();

        // Kontrollera om söktermen är minst ett tecken lång
        if (searchTerm.length >= 1) {
            // Hämta den första bokstaven från söktermen
            const searchPrefix = searchTerm.substring(0, 1);

            // Filtrera pokémon med namn som börjar med den bokstaven som angetts in input
            const searchResults = pokemons.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchPrefix));

            // Visa sökresultaten i dropdown om det finns några
            if (searchResults.length > 0) {
                showSearchResults(searchResults); // Anropa showSearchResults med sökresultaten
            } else {
                // Om inga sökresultat hittades, dölj dropdown
                searchResultsDropdown.style.display = 'none';
            }
        } else {
            // Om söktermen är kortare än ett tecken, dölj dropdown och rensa dropdownen
            searchResultsDropdown.style.display = 'none';
            searchResultsDropdown.innerHTML = '';
        }
    };

    // Funktion för att hantera val av alternativ i dropdown-listan
    const handleDropdownSelection = () => {
        const selectedPokemonName = searchResultsDropdown.value;
        searchPokemonInput.value = selectedPokemonName;
        renderSearchResult(); // Anropa renderSearchResult för att automatiskt starta sökningen
        searchResultsDropdown.size = 1; // Visa bara en rad (bara pilen)
    };

    // Lyssna på ändringar i dropdown-listan och hantera val av alternativ
    searchResultsDropdown.addEventListener('change', handleDropdownSelection);

    // Lyssna på inmatning i sökfältet och anropa handleSearch
    searchPokemonInput.addEventListener('input', handleSearch);
});
