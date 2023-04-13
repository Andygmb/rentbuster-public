async function compileData(address) {
    // Compile all the data
    // Returns an object with all the data
    data = await GetAllBasicData(address);
    data.energylabel = await GetEPData(address);
    data.monumentstatus = await GetMonumentStatus(address);
    console.log(data)
    return data;
}
