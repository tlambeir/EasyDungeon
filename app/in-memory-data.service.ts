export class InMemoryDataService {
    createDb() {
        let heroes = [
            { id: 11, name: 'Mr. Nice', posX:1, posY:2, image:'images/1.png' },
            { id: 12, name: 'Narco', posX:4, posY:3, image:'images/2.png'  },
            { id: 13, name: 'Bombasto', posX:3, posY:4, image:'images/3.png'  },
            { id: 14, name: 'Celeritas', posX:1, posY:5, image:'images/4.png'  },
            { id: 15, name: 'Magneta', posX:5, posY:6, image:'images/5.png'  },
            { id: 16, name: 'RubberMan', posX:9, posY:7, image:'images/6.png'  },
            { id: 17, name: 'Dynama', posX:7, posY:8, image:'images/1.png'  },
            { id: 18, name: 'Dr IQ', posX:4, posY:9, image:'images/1.png'  },
            { id: 19, name: 'Magma', posX:5, posY:10, image:'images/1.png'  },
            { id: 20, name: 'Tornado', posX:1, posY:11, image:'images/1.png'  }
        ];
        return {heroes};
    }
}


/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */