/**
 * Created by fernando on 28/02/14.
 */
angular.module('myApp.services', ['ngCookies']).
    factory('TokenHandler', [ '$cookieStore', function($cookieStore) {
        var tokenHandler = {};

        var formatDate = function (d) {
            // Padding for date creation
            var pad = function (num) {
                return ("0" + num).slice(-2);
            };

            return [d.getUTCFullYear(),
                pad(d.getUTCMonth() + 1),
                pad(d.getUTCDate())].join("-") + "T" +
                [pad(d.getUTCHours()),
                    pad(d.getUTCMinutes()),
                    pad(d.getUTCSeconds())].join(":") + "Z";
        };

        tokenHandler.getCredentials = function ( username, secret) {
            // Check if token is registered in cookies
            if ( (typeof $cookieStore.get('username') !== 'undefined') &&
                (typeof $cookieStore.get('digest') !== 'undefined') &&
                (typeof $cookieStore.get('b64nonce') !== 'undefined') &&
                (typeof $cookieStore.get('created') !== 'undefined') )
            {
                // Define variables from cookie cache
                var username = $cookieStore.get('username');
                var digest = $cookieStore.get('digest');
                var b64nonce = $cookieStore.get('b64nonce');
                var created = $cookieStore.get('created');
            }
            else
            {
                // Create token for backend communication
                var seed = Math.floor( Math.random() * 1000 )+'';
                // Encode seed in MD5
                var nonce = CryptoJS.MD5( seed ).toString(CryptoJS.enc.Hex);

                // Creation time of the token
                var created = formatDate(new Date());

                // Generating digest from secret, creation and seed
                var hash = CryptoJS.SHA1(nonce+created+secret);
                var digest = hash.toString(CryptoJS.enc.Base64);

                // Base64 Encode digest
                //var b64nonce = Base64.encode(nonce);
                var b64nonce = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(nonce));



                // Save token in cookies
                $cookieStore.put('username', username);
                $cookieStore.put('digest', digest);
                $cookieStore.put('nonce', b64nonce);
                $cookieStore.put('created', created);
            }

            // Return generated token
            return 'UsernameToken Username="'+username+'", PasswordDigest="'+digest+'", Nonce="'+b64nonce+'", Created="'+created+'"';
        };

        return tokenHandler;
    }]);