export class InMemoryDataService {
    createDb() {
        let heroes = [
            { id: 11, name: 'Mr. Nice', posX:1, posY:2, imagePath:'images/marker.jpg' },
            { id: 12, name: 'Narco', posX:4, posY:3, imagePath:'images/marker.jpg'  },
            { id: 13, name: 'Bombasto', posX:3, posY:4, imagePath:'images/marker.jpg'  },
            { id: 14, name: 'Celeritas', posX:1, posY:5, imagePath:'images/marker.jpg'  },
            { id: 15, name: 'Magneta', posX:5, posY:6, imagePath:'images/marker.jpg'  },
            { id: 16, name: 'RubberMan', posX:9, posY:7, imagePath:'images/marker.jpg'  },
            { id: 17, name: 'Dynama', posX:7, posY:8, imagePath:'images/marker.jpg'  },
            { id: 18, name: 'Dr IQ', posX:4, posY:9, imagePath:'images/marker.jpg'  },
            { id: 19, name: 'Magma', posX:5, posY:10, imagePath:'images/marker.jpg'  },
            { id: 20, name: 'Tornado', posX:1, posY:11, imagePath:'images/marker.jpg'  }
        ];
        return {heroes};
    }
}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */