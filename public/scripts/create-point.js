const ufSelect = document.querySelector("select[name=uf]");
const citySelect = document.querySelector("select[name=city]");
const stateInput = document.querySelector("input[name=state]");
const colletedItems = document.querySelector("input[name=items]");
let selectedItems = [];

function populateUfs(){
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( (res) => { return res.json()})
    .then( states => {
        for(state of states) {
            ufSelect.innerHTML +=  `<option value="${state.id}">${state.nome}</option>`
        }        
    });
}

 populateUfs();

 function getCities(event){
    const ufValue = event.target.value;
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;  
    
    const indexOfSelectedState = event.target.selectedIndex;
    stateInput.value = event.target.options[indexOfSelectedState].text;
    
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    citySelect.disabled = true;

    fetch(url)
    .then( (res) => { return res.json()})
    .then( cities => {
        for(city of cities) {
            citySelect.innerHTML +=  `<option value="${city.nome}">${city.nome}</option>`
        }
        citySelect.disabled = false;       
    });
 }

 ufSelect.addEventListener("change", getCities);

 //ITENS DE COLETA
const itemsToColect = document.querySelectorAll(".items-grid li");

for(item of itemsToColect) {
    item.addEventListener("click", handleSelectedItem)
}

function handleSelectedItem(event){
    const itemLi = event.target;    
    itemLi.classList.toggle("selected");
    const itemId = itemLi.dataset.id;

    const alreadySelected = selectedItems.findIndex(item => {  
        if(item == itemId){
            return item;
        }       
        // const itemFound = item == itemId
        // return itemFound
    });    
    if(alreadySelected >= 0){
        const filteredItems = selectedItems.filter( item => {
            if(item != itemId){
                return item
            }
        });
        selectedItems = filteredItems;
    } else {
        selectedItems.push(itemId);
    }
    colletedItems.value = selectedItems;
}



