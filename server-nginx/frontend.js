const url = 'http://localhost/'




async function testfunction(){
    try{
        const response = await fetch(`${url}test/`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }
        const payload = await response.json();
        console.log(payload);
        return payload
    } catch (error) {
        console.error(error.message)
        return null
    }
}

async function update_text(item, data, slot=-1){
    
    let title;
    if(slot>=0&&slot<=3)
        title = `${item}${slot}`
    else
        title = `${item}`

    const name = document.getElementById(`${title}-name`)
    const source = document.getElementById(`${title}-Source`)
    const type = document.getElementById(`${title}-Type`)
    const subtype = document.getElementById(`${title}-Subtype`)
    const misc = document.getElementById(`${title}-Misc`)

    console.log(`data ${data}`)
    console.log(`data["Name"] ${data["Name"]}`)
    console.log(`data.Name ${data.Name}`)

    name.textContent = data["Name"]
    source.textContent = data["Source"]
    type.textContent = data["Class"]
    if(data.Class == "Primary" || data.Class =="Secondary" ||data.Class=="Throwable"){
        subtype.textContent = `${data["W Class"]}`
        misc.textContent = `AP-${data["W Penetration"]}`
    }else if(data.Class == "Armor"){
        subtype.textContent = `${data["A Weight"]}`
        misc.textContent = `${data["A Perk"]} Perk`
    }else if(data.Class == "Strategem"){
        subtype.textContent = `${data["S Category"]}`
        misc.textContent = `${data["S Classification"]}`
    }else{
        subtype.textContent = `n/a`
        misc.textContent = `n/a`
    }



}

async function random_selection(item,slot=-1){
    console.log(`selecting a random ${item}`)
    try{

        const filtersArray = []
        
        const cookieArray = document.cookie.split(';'); // Split cookies into an array
        for (let i = 0; i < cookieArray.length; i++) {
            const cookie = cookieArray[i].trim(); // Remove leading/trailing spaces
            if (!cookie.startsWith('preset')) {
                const splitagain = cookie.split('=')
                if(splitagain[1]=='true'){
                    filtersArray.push(splitagain[0])
                }
            }
        }
        const payload = {
            "select":item,
            "filters":filtersArray
        }

        console.log(`Payload: ${ JSON.stringify(payload)}`)

        //use post to save message
        const response = await fetch(`${url}select/`, {
            method: "POST", 
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(`${JSON.stringify(data)}`)
        update_text(item, data ,slot)
    } catch (error) {
        console.error(error.message)
    }
}

async function full_randomize(){
    await random_selection('Primary')
    await random_selection('Secondary')
    await random_selection('Throwable')
    await random_selection('Armor')
    await random_selection('Helmet')
    await random_selection('Cape')
    await random_selection('Strategem',0)
    await random_selection('Strategem',1)
    await random_selection('Strategem',2)
    await random_selection('Strategem',3)
    await random_selection('Booster')
}



async function getPayload(){
    try{
        //fetch the list of loot sources as an array of {type:'',name:''} structures
        const response = await fetch(`${url}filters/`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        // if the response isnt 200, log that
        if (!response.ok){ 
            throw new Error(`Response status: ${response.status}`); 
        }
        
        // get the json payload from the response
        const payload = await response.json();
        console.log(payload)
        return payload
    } catch(error){
        console.error(error.message) 
    }
}

//from https://www.w3schools.com/js/js_cookies.asp
function getCookie(name) {
    const cookieArray = document.cookie.split(';'); // Split cookies into an array
    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim(); // Remove leading/trailing spaces
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1)); // Return the cookie value
        }
    }
    return null; // Return null if the cookie is not found
}

async function updateCookies(name,value){
    document.cookie = `${name}=${value}`
}

async function updateCheckboxes(payload,preset = ''){
    for (const element of payload) {
        const checkbox = document.getElementById(`checkbox-${element.Name}`)
        const cookie = getCookie(`${preset}${element.Name}`)
        
        if(cookie != null){
            if(cookie==`false`){
                checkbox.checked = false
                updateCookies(`${element.Name}`,`false`)
            }else if(cookie==`true`){
                checkbox.checked = true
                updateCookies(`${element.Name}`,`true`)
            }                            
        }else{
            updateCookies(`${preset}${element.Name}`,`false`)
            checkbox.checked = false
        }
        // console.log(`cookie ${preset}${element.Name}=${cookie}`)
    }
}

async function updatePreset(payload,preset=''){
    for (const element of payload) {
        const checkbox = document.getElementById(`checkbox-${element.Name}`)
        updateCookies(`${preset}${element.Name}`,checkbox.checked)
    }
}

async function generatePage(){
    try{
    const uniqueTypes = [...new Set(payload.map(item => item.Type))];

    // for each unique type, create a header of that type
    for (const type of uniqueTypes) {
        //ask chatgpt how to create elements with a structure I want so that css is maintained, then edit to fit my needs :p
        // Create the parent div with class "filter-group"
        const filterGroup = document.createElement('div');
        filterGroup.className = 'filter-group';

        // Create the h3 element with text "type"
        const heading = document.createElement('h3');
        heading.textContent = `${type}`;
        filterGroup.appendChild(heading);
        // Append the entire structure to the body (or any other container)
        const parent = document.getElementById("div1")
        parent.appendChild(filterGroup)
        
        for (const element of payload) {
            if (element.Type === type) {
                // Create labels with checkboxes for each name
                const label = document.createElement('label');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id=`checkbox-${element.Name}`
                checkbox.onclick = function(){updateCookies(element.Name,this.checked)};
                
                label.appendChild(checkbox);
                label.append(` ${element.Name}`); // Add a space and the name text
                filterGroup.appendChild(label);
            }
        }
    }

    document.getElementById('checkbox-Base Equipment').checked = true
    document.getElementById('checkbox-Base Equipment').disabled = true
    
    
    //handle errors fgrom the try above
    } catch (error) { 
    console.error(error.message) 
    }
}
