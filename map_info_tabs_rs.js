class MapInfoTabsRS{ 
    constructor() {
        this.InfoTab1 = "Test";
        
        this.InfoTab2 = "Test";

        this.InfoTab3 = "Test ";
    }

    getMapInfoTabList(){
        return [this.InfoTab1, this.InfoTab2, this.InfoTab3];
    }
  }