class Cities {
    constructor(cityArray) {
        this.CityArray = cityArray;
    }
//test
    getCityById(id){
        var result = this.CityArray.find(obj => {
            return obj.id === id;
          })

        return result;
    }
}