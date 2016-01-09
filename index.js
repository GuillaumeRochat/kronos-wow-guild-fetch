var Firebase = require('firebase');

var ref = new Firebase('https://' + process.env.FIREBASE_SUBDOMAIN + '.firebaseio.com');
ref.authWithCustomToken(process.env.FIREBASE_AUTH, function(error, authData) {
    if(error) {
        console.log('Error ', error);
    }
    else {
        console.log('Success ', authData);
        ref.set({
            title: 'blabla',
            author: 'blablabla',
            localtion: {
                city: 'blabla',
                country: 'blablabla'
            }
        });
        process.exit(0);
    }
});

