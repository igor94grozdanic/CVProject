class LocationsTest {
    constructor(locationsArray) {
        this.locationsArray = locationsArray;
    }

    getLocationsByTypeId(location_type_id){
        var result = this.locationsArray.filter(obj => {
            return obj.location_type_id === location_type_id;
          })

        return result;
    }

    getLocationsByPriority(priority){
      var result = this.locationsArray.filter(obj => {
          return obj.priority === priority;
        })

      return result;
    }

    getLocationNameByLocationId(locationId){
      var result = "";

      this.locationsArray.forEach((item) => {
        if (item.location_id == locationId){
          result = item.name;
        }
      });

      return result;
    }

    getLocationImageURLByLocationId(locationId){
      var result = "";

      this.locationsArray.forEach((item) => {
        if (item.location_id == locationId){
          result = item.image_url_location;
        }
      });

      return result;
    }

    getLocationXCoordByLocationId(locationId){
      var result = "";

      this.locationsArray.forEach((item) => {
        if (item.location_id == locationId){
          result = parseFloat(item.x_coord);
        }
      });

      return result;
    }

    getLocationYCoordByLocationId(locationId){
      var result = "";

      this.locationsArray.forEach((item) => {
        if (item.location_id == locationId){
          result = parseFloat(item.y_coord);
        }
      });

      return result;
    }

    getLocationTypeIdByLocationId(locationId){
      var result = "";

      this.locationsArray.forEach((item) => {
        if (item.location_id == locationId){
          result = item.location_type_id;
        }
      });

      return result;
    }
}